'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { COMMENT_LEVELS, CommentLevel } from '@/lib/comment-levels';

interface CommentLevelSelectProps {
  value: CommentLevel;
  onChange: (value: CommentLevel) => void;
}

export function CommentLevelSelect({ value, onChange }: CommentLevelSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a level" />
      </SelectTrigger>
      <SelectContent>
        {COMMENT_LEVELS.map((level) => (
          <SelectItem key={level.value} value={level.value}>
            {level.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
