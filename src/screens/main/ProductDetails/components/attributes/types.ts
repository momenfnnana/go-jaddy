interface IAttribute {
  selectAttributeHandler?: ({attributeValue, attribute}: any) => void;
  attributeValue?: any;
  item: any;
}
export type {IAttribute};
