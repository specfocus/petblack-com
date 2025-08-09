import {atom, type WritableAtom} from "jotai/vanilla/atom";
import {atomFamily} from "jotai/vanilla/utils/atomFamily";
import {type Entry} from "@/state/entry";
import {type SetStateActionWithReset} from "@/state/reset";
import {atomWithStorage} from "@/state/storage";

export const SEPARATOR = '/';

export const splitSection = (id: string): [string, string] => {
    const index = id.lastIndexOf(SEPARATOR);
    return index > -1 ? [id.slice(0, index), id.slice(index + 1)] : ['', id];
};

export interface SectionValue {
    id: string;
    name: string;
    visible?: boolean;
    [key: string]: unknown;
}

export const hideSection = (draft: SectionValue): SectionValue => ({
    ...draft,
    visible: false,
});

export const showSection = (draft: SectionValue): SectionValue => ({
    ...draft,
    visible: true,
});

export const toggleSection = (draft: SectionValue): SectionValue => ({
    ...draft,
    visible: !draft.visible,
});

export type SectionAtom = WritableAtom<SectionValue, [SetStateActionWithReset<SectionValue>], void>;

export type SectionEntry = Entry<SectionValue>;

export type SectionList = SectionEntry[];

export type SectionExclusionList = string[];

export type SectionExclusionLists = SectionExclusionList[];

export const sectionAtomFamily = atomFamily(
    (id: string) =>
        atomWithStorage<SectionValue>(
            `section-${id}`,
            {
                id,
                name: id,
                visible: undefined,
                // other initial values
            })
);

export const sectionExclusionLists = atom<SectionExclusionLists>([]);
