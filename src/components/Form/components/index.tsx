import Text from './Text';
import Password from './Password';
import Checkbox from './Checkbox';
import ColorPicker from './ColorPicker';
import Slider from './Slider';
import Rating from './Rating';
import { FormComponent } from '../types';

const COMPONENTS = {
	[FormComponent.Text]: Text,
	[FormComponent.Password]: Password,
	[FormComponent.Checkbox]: Checkbox,
	[FormComponent.ColorPicker]: ColorPicker,
	[FormComponent.Slider]: Slider,
	[FormComponent.Rating]: Rating,
};

export default COMPONENTS;
