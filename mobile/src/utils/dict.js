import { getDicts } from '@/api/flowable/todo.js';
import { ref, toRefs } from 'vue';

/**
 * 获取字典数据
 */
export function useDict(...args) {
  const res = ref({});
  return (() => {
    args.forEach(dictType => {
      getDicts(dictType).then(resp => {
        res.value[dictType] = resp.data.map(p => ({
          label: p.dictLabel,
          value: p.dictValue,
          elTagType: p.listClass,
          elTagClass: p.cssClass,
          remark: p.remark
        }));
      });
    });
    return res.value;
  })();
}
