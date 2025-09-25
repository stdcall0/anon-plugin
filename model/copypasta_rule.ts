/*
rules:
  - trigger: ""
    response: ""
    enabled_groups:
      - 123456789
    disabled_groups: []
    enable_pm: false
*/
import _ from 'lodash';

export interface CopypastaRule {
    trigger: string;
    response: string;
    enabled_groups: number[];
    disabled_groups: number[];
    enable_pm: boolean;
};

export function isCopypastaRule(obj: any): obj is CopypastaRule {
    return obj && typeof obj.trigger === 'string' && typeof obj.response === 'string'
        && _.isArray(obj.enabled_groups) && _.isArray(obj.disabled_groups)
        && typeof obj.enable_pm === 'boolean'
        && obj.enabled_groups.every((id: any) => _.isFinite(id))
        && obj.disabled_groups.every((id: any) => _.isFinite(id));
}
