/**
 * Node/Component/Route mapper gibi nesneleri doğrudan export etmek yerine
 * lazy fonksiyonla export et: hoisting + döngü riskini azaltır.
 *
 * Örnek:
 *   let _map: Record<string, any>|null = null;
 *   export function getNodeMapper() {
 *     if (!_map) { _map = { heading: Heading, h: Heading }; }
 *     return _map;
 *   }
 */
export {}; // sadece rehber
