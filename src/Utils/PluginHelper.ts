import { SettingsType } from "@src/Settings/SettingsType";
import { Feature } from "@src/Enum";
import { StrategyType, ValidatorType } from "../Feature/Alias/Types";
import { NoteLinkStrategy } from "@src/Feature/NoteLink/NoteLinkTypes";

export default class PluginHelper {
    public static createDefaultSettings(): SettingsType {
        return {
            templates: {
                common: { main: "title", fallback: "fallback_title" },
                ...Object.fromEntries(Object.values(Feature).map(e => [e, { main: null, fallback: null }])),
            },
            rules: {
                paths: {
                    mode: "black",
                    values: [],
                },
                delimiter: {
                    enabled: false,
                    value: "",
                },
            },
            debug: false,
            boot: {
                delay: 1000,
            },
            features: {
                [Feature.Alias]: {
                    enabled: false,
                    strategy: StrategyType.Ensure,
                    validator: ValidatorType.FrontmatterRequired,
                },
                [Feature.Explorer]: { enabled: false },
                [Feature.ExplorerSort]: { enabled: false },
                [Feature.Tab]: { enabled: false },
                [Feature.Header]: { enabled: false },
                [Feature.Graph]: { enabled: false },
                [Feature.Starred]: { enabled: false },
                [Feature.Search]: { enabled: false },
                [Feature.Suggest]: { enabled: false },
                [Feature.InlineTitle]: { enabled: false },
                [Feature.Canvas]: { enabled: false },
                [Feature.Backlink]: { enabled: false },
                [Feature.NoteLink]: { enabled: false, strategy: NoteLinkStrategy.OnlyEmpty, approval: true },
            },
            processor: {
                args: [],
                type: null,
            },
        };
    }
}
