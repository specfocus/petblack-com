'use client';

import { type FC } from 'react';
import BucketWidget from '@/widgets/bucket/bucket-widget';
import { PrefabBucketNames } from '@/dialogs/settings/sections/shop/domain/types';

const PickWidget: FC = () => <BucketWidget bucketName={PrefabBucketNames.Pick} />;

export default PickWidget;
