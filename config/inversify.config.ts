import "reflect-metadata";
import { Container as _Container } from "inversify";
import SI from "./inversify.types";
import CreatorModule from "./services/creator.config";
import bindFeature from "./services/feature.config";
import bindSettings from "./services/settings.config";
import processorModule from "./services/processors.config";
import resolverModule from "./services/resolver.config";
import apiAdapterModule from "./services/api.adapter.config";
import FilterInterface from "../src/Interfaces/FilterInterface";
import ExtensionFilter from "../src/Filters/ExtensionFilter";
import PathListFilter from "../src/Filters/PathListFilter";
import BlackWhiteListInterface from "@src/Components/BlackWhiteList/BlackWhiteListInterface";
import BlackWhiteList from "@src/Components/BlackWhiteList/BlackWhiteList";
import Cache from "@src/Components/Cache/Cache";
import CacheInterface from "@src/Components/Cache/CacheInterface";
import Extractor from "@src/Components/Extractor/Extractor";
import ExtractorInterface from "@src/Components/Extractor/Interfaces/ExtractorInterface";
import StrategyInterface from "@src/Components/Extractor/Interfaces/StrategyInterface";
import LiteralStrategy from "@src/Components/Extractor/LiteralStrategy";
import ArrayStrategy from "@src/Components/Extractor/ArrayStrategy";
import NullStrategy from "@src/Components/Extractor/NullStrategy";
import LoggerInterface from "@src/Components/Debug/LoggerInterface";
import LoggerComposer from "@src/Components/Debug/LoggerComposer";
import FileNoteLinkService from "@src/Utils/FileNoteLinkService";
import ListenerInterface from "@src/Interfaces/ListenerInterface";
import EventDispatcherInterface from "@src/Components/EventDispatcher/Interfaces/EventDispatcherInterface";
import { EventDispatcher } from "@src/Components/EventDispatcher/EventDispatcher";
import BlackWhiteListListener from "@src/Components/BlackWhiteList/BlackWhiteListListener";
import FunctionReplacer from "@src/Utils/FunctionReplacer";
import ProcessorListener from "../src/Components/Processor/ProccessorListener";
import FakeTitleElementService from "@src/Utils/FakeTitleElementService";
import BooleanStrategy from "@src/Components/Extractor/BooleanStrategy";
import SearchDomWrapperService from "../src/Utils/SearchDomWrapperService";

const Container = new _Container();
Container.bind<EventDispatcherInterface<any>>(SI["event:dispatcher"]).to(EventDispatcher).inSingletonScope();
Container.bind<string>(SI["template:pattern"]).toConstantValue("(?<placeholder>{{[^{}]+?}})");

Container.bind<FilterInterface>(SI.filter).to(ExtensionFilter);
Container.bind<FilterInterface>(SI.filter).to(PathListFilter);
Container.bind<BlackWhiteListInterface>(SI["component:black_white_list"]).to(BlackWhiteList).inSingletonScope();
Container.bind<CacheInterface>(SI.cache).to(Cache);
Container.bind<ExtractorInterface>(SI["component:extractor"]).to(Extractor);
Container.bind<StrategyInterface>(SI["component:extractor:strategy"]).to(LiteralStrategy);
Container.bind<StrategyInterface>(SI["component:extractor:strategy"]).to(ArrayStrategy);
Container.bind<StrategyInterface>(SI["component:extractor:strategy"]).to(NullStrategy);
Container.bind<StrategyInterface>(SI["component:extractor:strategy"]).to(BooleanStrategy);
Container.bind(SI["logger:composer"]).to(LoggerComposer).inSingletonScope();
Container.bind<LoggerInterface>(SI.logger)
    .toDynamicValue(context => {
        return context.container
            .get<LoggerComposer>(SI["logger:composer"])
            .create(context.currentRequest.target.getNamedTag().value);
    })
    .when(() => true);

Container.bind(SI["service:note:link"]).to(FileNoteLinkService).inSingletonScope();
Container.bind(SI["service:fake_title_element"]).to(FakeTitleElementService);
Container.bind<ListenerInterface>(SI.listener).to(BlackWhiteListListener).whenTargetNamed("unnamed");
Container.bind<ListenerInterface>(SI.listener).to(ProcessorListener).whenTargetNamed("unnamed");

Container.load(CreatorModule);
bindFeature(Container);
bindSettings(Container);
Container.load(processorModule);
Container.load(resolverModule);
Container.load(apiAdapterModule);

Container.bind(SI["factory:replacer"]).toFunction((t: any, m: any, a: unknown, i: any) =>
    FunctionReplacer.create(t, m, a, i)
);
Container.bind(SI["service:search:dom:wrapper"]).to(SearchDomWrapperService).inSingletonScope();

export default Container;
