function getProperty(property) {
  const value = PropertiesService.getScriptProperties().getProperty(property);
  if (!value) {
    throw new Error(`The property '${property}' is not set.`);
  }
  return value;
}
