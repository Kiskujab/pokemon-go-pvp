import { mount, goMenu } from "./mount";
import WeatherGuide from "../components/weather/WeatherGuide";

mount(<WeatherGuide onExit={goMenu} />);
