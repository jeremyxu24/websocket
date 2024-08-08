export function grey(value) {
    let reference = {
        50: '#fafafa',
        100: '#f5f5f5',
        200: '#eeeeee',
        300: '#e0e0e0',
        400: '#bdbdbd',
        500: '#9e9e9e',
        600: '#757575',
        700: '#616161',
        800: '#424242',
        900: '#212121'
    };

    return reference[value];
}

export const columnColor = {
    String: '#CCD5AE',
    Number: '#E9EDC9',
    Array: "#FEFAE0",
    Date: "#FAEDCD",
    Datetime: "#D4A373",
}