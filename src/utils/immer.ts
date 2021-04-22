// eslint-disable-next-line import/no-unresolved
import { WritableDraft } from 'immer/dist/types/types-external';

const updateImmerDraft = (
	draft: WritableDraft<DynamicObject>,
	payload: DynamicObject
) => {
	Object.keys(payload).forEach(key => {
		draft[key] = payload[key];
	});
};

export { updateImmerDraft };
