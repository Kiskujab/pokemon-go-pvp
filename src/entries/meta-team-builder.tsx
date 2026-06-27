import { mount, goMenu } from "./mount";
import AnalysisScreen from "../components/analysis/AnalysisScreen";

mount(<AnalysisScreen onExit={goMenu} />);
