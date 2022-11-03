interface IAttribute {
  selectAttributeHandler?: ({attributeValue, attribute}: any) => void;
  attributeValue?: any;
  item: any;
  onSelect: (value: any) => void;
}
export type {IAttribute};
