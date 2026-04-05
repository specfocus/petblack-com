'use client';

import { type FC } from 'react';
import BucketWidget from '@/widgets/bucket/bucket-widget';
import { PrefabBucketNames } from '@/domain/types';

const AutoWidget: FC = () => <BucketWidget bucketName={PrefabBucketNames.Auto} />;

export default AutoWidget;
