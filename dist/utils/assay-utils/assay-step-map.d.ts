import { AbstractMultiKeyMap } from "./abstract-multi-key-map";
declare type StepInfo = {
    assay?: string;
    step: string;
};
export declare class AssayStepMap extends AbstractMultiKeyMap {
    constructor(assayStepValues?: Record<string, any>[]);
    serializeKey: ({ assay, step }: StepInfo) => string;
    deserializeKey: (serializedKey: string) => {
        assay: string;
        step: string;
    };
}
export {};
