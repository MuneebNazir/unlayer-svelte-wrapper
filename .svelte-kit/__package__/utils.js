/**
 * Validates if a design object has the correct structure
 */
export function isValidDesign(design) {
    return (typeof design === 'object' &&
        design !== null &&
        (design.body === undefined || typeof design.body === 'object'));
}
/**
 * Validates if export data has the correct structure
 */
export function isValidExportData(data) {
    return (typeof data === 'object' &&
        data !== null &&
        typeof data.html === 'string' &&
        typeof data.design === 'object');
}
/**
 * Creates a sample design for testing purposes
 */
export function createSampleDesign() {
    return {
        body: {
            rows: [
                {
                    cells: [1],
                    columns: [
                        {
                            contents: [
                                {
                                    type: 'text',
                                    values: {
                                        text: '<h1>Welcome!</h1><p>This is a sample email template.</p>',
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    };
}
/**
 * Sanitizes HTML content for safe display
 */
export function sanitizeHtml(html) {
    return html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '');
}
/**
 * Formats file size in human-readable format
 */
export function formatFileSize(bytes) {
    if (bytes === 0)
        return '0 Bytes';
    var k = 1024;
    var sizes = ['Bytes', 'KB', 'MB', 'GB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
/**
 * Debounces a function call
 */
export function debounce(func, wait) {
    var timeout;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        clearTimeout(timeout);
        timeout = setTimeout(function () { return func.apply(void 0, args); }, wait);
    };
}
/**
 * Creates a deep copy of an object
 */
export function deepClone(obj) {
    if (obj === null || typeof obj !== 'object')
        return obj;
    if (obj instanceof Date)
        return new Date(obj.getTime());
    if (obj instanceof Array)
        return obj.map(function (item) { return deepClone(item); });
    if (typeof obj === 'object') {
        var copy_1 = {};
        Object.keys(obj).forEach(function (key) {
            copy_1[key] = deepClone(obj[key]);
        });
        return copy_1;
    }
    return obj;
}
