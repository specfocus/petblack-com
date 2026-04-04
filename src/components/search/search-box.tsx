import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
    Fragment,
    useCallback,
    useDeferredValue,
    useEffect,
    useRef,
    useState,
    type FC
} from "react";
import {
    useAtom,
    useAtomValue
} from "jotai";
import {
    atomWithQuery
} from "jotai-tanstack-query";
import {
    
} from "@/components/search/family";

export enum ResourceTypes {
    Component = 'Component',
    Domain = 'Domain',
    Emoji = 'Emoji',
    Icon = 'Icon',
    List = 'List',
    Locale = 'Locale',
    Picture = 'Picture',
    Pictograph = 'Pictograph',
    Vectograph = 'Vectograph',
    Visual = 'Visual'
}

export interface Metadata {
    title: string;
    description: string;
}

export interface IdReference {
    /** IRI identifying the canonical address of this object. */
    "@id"?: string;
}

export interface Variant extends IdReference, Partial<Metadata> {
    groups?: string[];
}

export interface ResourceBase extends Variant {
    "@type": `${ResourceTypes}` | string;
    category?: string;
    family?: string;
    name: string;
    ns?: string;
    error?: string;
    // thumbnail?: PictographObject | string | null;
}

export interface Resource extends ResourceBase {
    "@type": string;
    "@id"?: string;
    /** Unique identifier for referencing the visual (e.g., for tracking or lookup, in <use> or CSS). No default. */
    name: string;
}

export const searchBoxSectionAtom = sectionAtomFamily('search-box');
export const mediaEditorSectionAtom = sectionAtomFamily('media-editor');

export const queryResultAtom = atomWithQuery<Resource[], DefaultError, Resource[], QueryParams>(
    (get: Getter) => ({
        queryKey: ['search-index', get(searchParamAtomFamily('q'))],
        queryFn: async ({queryKey: [, query]}): Promise<Resource[]> => {
            if (!query) {
                return [];
            }
            const queryString = Array.isArray(query) ? query.join(' ') : query;
            const results: SearchResults = await search(queryString, {limit: 3000});
            const {sources}: GraphicContext = get(graphicContext);

            const mapFn = (key: Id): Resource | undefined => {
                const [sourceId, itemName, ...itemIdSpread] = String(key).split(':');
                const itemId: string = [itemName, ...itemIdSpread].join(':');
                const source: GlyphSource | undefined = sources.get(sourceId);
                if (!source) {
                    console.warn(`Source not found for key: ${key}`);
                    return undefined;
                }

                const similar: Resource[] = source.items.filter(({name}: Resource) => name === itemName);

                if (similar.length === 0) {
                    console.warn(`=== DEBUG No similar items found for key: ${key}`);
                    return undefined;
                }

                let match: Resource | undefined;

                if (similar.length === 1) {
                    [match] = similar;
                } else {
                    match = similar.find(({"@id": id}: Resource) => id === itemId);
                    if (!match) {
                        [match] = similar;
                    }
                }

                const glyph = get(source.glyphs(itemId));

                if (glyph) {
                    // @ts-ignore
                    return Object.assign({
                        ...glyph
                    }, match);
                }

                console.warn(`=== DEBUG No visual found for itemId: ${itemId}`);

                return Object.assign({
                    "@type": ResourceTypes.Pictograph as `${ResourceTypes.Pictograph}`,
                    type: 'emoji',
                }, match);
            };
            const filterFn = (item: Resource | undefined): item is Resource => Boolean(item);

            if (Array.isArray(results)) {
                return results.map(mapFn).filter(filterFn);
            }

            if ('result' in results) {
                return results.result.flat().map(mapFn).filter(filterFn);
            }

            console.warn('Unexpected search results format:', results);

            return [];
        }
    })
);


interface QueryResult {
    isSuccess: boolean;
    isLoading: boolean;
    isError: boolean;
    error?: unknown;
}

interface SearchBoxProps {
    paramName: string;
    placeholder?: string;
}

const SearchBox: FC<SearchBoxProps> = ({
    paramName,
    placeholder
}) => {
    const [section, setSection] = useAtom(searchBoxSectionAtom);
    const searchResult = useAtomValue(queryResultAtom) as QueryResult;
    const items = searchResult.isSuccess ? searchResult.data ?? [] : [];
    const deferredItems = useDeferredValue(items);
    const isPending = searchResult.isLoading || deferredItems !== items;
    const dialogInputRef = useRef<HTMLInputElement>(null);

    const handleOnChange = useCallback(
        (value: string) => {
            if (section.visible && value.length === 0) {
            }
            else if (!section.visible && value.length > 1) {
                setTimeout(() => {
                    dialogInputRef.current?.focus();
                }, 50);
            }
        },
        [section, setSection],
    );

    return (
        <StickyPaper borderRadius="22px">
            <SearchInput
                isPending={isPending}
                paramName={paramName}
                placeholder={placeholder}
                onChange={handleOnChange}
            />
        </StickyPaper>

    );
};

export default SearchBox;
