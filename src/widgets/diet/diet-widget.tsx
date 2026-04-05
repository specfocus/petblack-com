'use client';

import { type FC } from 'react';
import BucketWidget from '@/widgets/bucket/bucket-widget';
import { PrefabBucketNames } from '@/domain/types';

const DietWidget: FC = () => <BucketWidget bucketName={PrefabBucketNames.Diet} />;

export default DietWidget;
