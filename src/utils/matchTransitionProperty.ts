import removeVendorPrefix from "./removeVendorPrefix";

export function matchTransitionProperty(subject: string, property: string): boolean {
  if (property === "all") {
    return true;
  }
  const sub = removeVendorPrefix(subject);
  const prop = removeVendorPrefix(property);
  if (sub.length < prop.length) {
    return false;
  } else if (sub.length === prop.length) {
    return sub === prop;
  }
  return sub.substr(0, prop.length) === prop;
}

export default matchTransitionProperty;
