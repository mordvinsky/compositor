import defaults from "../defaults";

export default function(key, prop) {
  if (typeof prop === "function") return prop;
  else return defaults[key]
}
