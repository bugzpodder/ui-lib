// @flow
import { AbstractMultiKeyMap } from "./abstract-multi-key-map";
// delimiter must never be in assay and step:
const delimiter = "<-=->";

type StepInfo = {
  assay?: string,
  step: string,
};

export class AssayStepMap extends AbstractMultiKeyMap {
  constructor(assayStepValues?: Array<Object>) {
    super();
    assayStepValues
      && assayStepValues.forEach(({ assay, step, value }) => {
        this.set({ assay, step }, value);
      });
  }

  serializeKey = ({ assay = "", step }: StepInfo) => {
    if (assay !== undefined && step !== undefined) {
      return `${assay}${delimiter}${step}`;
    }
    throw new Error("Must define assay and step");
  };

  deserializeKey = (serializedKey: string) => {
    const [assay, step] = serializedKey.split(delimiter);
    return { assay, step };
  };
}
