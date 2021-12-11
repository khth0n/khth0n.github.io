export function is_positive(x) { return x > 0; }
export function int_param(element, attribute, default_value = 0) {
    return parseInt(element.getAttribute(attribute) || '') || default_value;
}
export function int_params(element, attributes, default_values = []) {
    let params = new Uint16Array(attributes.length);
    if (default_values.length) {
        for (let i = 0; i < attributes.length; i++) {
            params[i] = int_param(element, attributes[i]);
        }
    }
    else {
        for (let i = 0; i < attributes.length; i++) {
            params[i] = int_param(element, attributes[i], default_values[i]);
        }
    }
    return params;
}
export function random_hex(length) {
    let hex_values = [];
    for (let i = 0; i < length; i++) {
        hex_values.push(Math.trunc(Math.random() * 16).toString(16));
    }
    return `#${hex_values.join('')}`;
}
export function random_int(max_int) {
    return Math.trunc(Math.random() * max_int);
}
export function chunk_str(str, chunk_size) {
    return str.match(new RegExp(`.{1,${chunk_size}}`, 'g'));
}
