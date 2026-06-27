import { mount, goMenu } from "./mount";
import DexScreen from "../components/dex/DexScreen";

mount(<DexScreen onExit={goMenu} />);
