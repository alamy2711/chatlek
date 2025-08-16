/**
 * Formats a JavaScript Date object into a string based on a custom format pattern.
 *
 * Supported format tokens include:
 *
 * - d     : Day of the month (1-31) without leading zero
 * - dd    : Day of the month (01-31) with leading zero
 * - ddd   : Abbreviated weekday name (e.g., "Mon")
 * - dddd  : Full weekday name (e.g., "Monday")
 *
 * - M     : Month (1-12) without leading zero
 * - MM    : Month (01-12) with leading zero
 * - MMM   : Abbreviated month name (e.g., "Jan")
 * - MMMM  : Full month name (e.g., "January")
 *
 * - yy    : 2-digit year (e.g., "24")
 * - yyyy  : 4-digit year (e.g., "2024")
 *
 * - H     : Hours (0-23) without leading zero
 * - HH    : Hours (00-23) with leading zero
 * - h     : Hours (1-12) without leading zero
 * - hh    : Hours (01-12) with leading zero
 * - m     : Minutes without leading zero
 * - mm    : Minutes with leading zero
 * - s     : Seconds without leading zero
 * - ss    : Seconds with leading zero
 * - A     : AM or PM (uppercase)
 * - a     : am or pm (lowercase)
 *
 * @param {Date} date - A valid JavaScript Date object.
 * @param {string} format - A string containing formatting tokens (e.g., "dd/MM/yyyy").
 * @returns {string} - The formatted date string.
 *
 * @example
 * formatDate(new Date(2000, 10, 15), "dd-MM-yyyy")     // "15-11-2000"
 * formatDate(new Date(), "dddd, MMMM dd yyyy")         // "Saturday, April 05 2025"
 * formatDate(new Date(), "hh:mm A")                    // "02:47 PM"
 */
export function formatDate(date, formatStr) {
    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    const shortDays = days.map((day) => day.slice(0, 3));
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const shortMonths = months.map((month) => month.slice(0, 3));

    const pad = (n, width = 2) => String(n).padStart(width, "0");

    const replacements = {
        dddd: days[date.getDay()],
        ddd: shortDays[date.getDay()],
        dd: pad(date.getDate()),
        d: date.getDate(),

        MMMM: months[date.getMonth()],
        MMM: shortMonths[date.getMonth()],
        MM: pad(date.getMonth() + 1),
        M: date.getMonth() + 1,

        yyyy: date.getFullYear(),
        yy: String(date.getFullYear()).slice(-2),

        hh: pad(((date.getHours() + 11) % 12) + 1),
        h: ((date.getHours() + 11) % 12) + 1,
        HH: pad(date.getHours()),
        H: date.getHours(),

        mm: pad(date.getMinutes()),
        m: date.getMinutes(),

        ss: pad(date.getSeconds()),
        s: date.getSeconds(),

        tt: date.getHours() >= 12 ? "PM" : "AM",
        t: date.getHours() >= 12 ? "P" : "A",
        TT: date.getHours() >= 12 ? "PM" : "AM",
        T: date.getHours() >= 12 ? "P" : "A",
    };

    // Replace longer tokens first to prevent substring overlaps (e.g., 'dddd' before 'dd')
    const tokenRegex = new RegExp(
        Object.keys(replacements)
            .sort((a, b) => b.length - a.length)
            .join("|"),
        "g",
    );

    return formatStr.replace(tokenRegex, (match) => replacements[match]);
}

/**
 * Parses a date string using a format string and returns a JavaScript Date object.
 *
 * Supported format tokens (must match exactly):
 * - d      : Day of month (1–31)
 * - dd     : Day of month (01–31)
 * - M      : Month (1–12)
 * - MM     : Month (01–12)
 * - MMM    : Abbreviated month name (e.g., "Nov")
 * - MMMM   : Full month name (e.g., "November")
 * - yy     : Two-digit year (e.g., "00")
 * - yyyy   : Four-digit year (e.g., "2000")
 * - h / hh : Hour (1–12)
 * - H / HH : Hour (0–23)
 * - m / mm : Minute
 * - s / ss : Second
 * - tt / TT: AM or PM (for 12-hour time)
 *
 * @param {string} dateStr - The string to parse
 * @param {string} formatStr - The format that matches the string
 * @returns {Date} - Parsed Date object
 */
export function parseDate(dateStr, formatStr) {
    const weekdays = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    const shortWeekdays = weekdays.map((d) => d.slice(0, 3));
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const shortMonths = months.map((m) => m.slice(0, 3));

    const tokenMap = {
        d: "(\\d{1,2})",
        dd: "(\\d{2})",
        M: "(\\d{1,2})",
        MM: "(\\d{2})",
        MMM: `(${shortMonths.join("|")})`,
        MMMM: `(${months.join("|")})`,
        yy: "(\\d{2})",
        yyyy: "(\\d{4})",
        h: "(\\d{1,2})",
        hh: "(\\d{2})",
        H: "(\\d{1,2})",
        HH: "(\\d{2})",
        m: "(\\d{1,2})",
        mm: "(\\d{2})",
        s: "(\\d{1,2})",
        ss: "(\\d{2})",
        tt: "(AM|PM)",
        TT: "(AM|PM)",
        ddd: `(?:${shortWeekdays.join("|")})`, // non-capturing
        dddd: `(?:${weekdays.join("|")})`, // non-capturing
    };

    const tokenOrder = [];

    const regexStr = formatStr.replace(
        /(d{1,4}|M{1,4}|y{2,4}|h{1,2}|H{1,2}|m{1,2}|s{1,2}|t{1,2}|T{1,2})/g,
        (match) => {
            if (["ddd", "dddd"].includes(match)) {
                return tokenMap[match]; // skip capturing
            } else {
                tokenOrder.push(match);
                return tokenMap[match] || match;
            }
        },
    );

    const regex = new RegExp("^" + regexStr + "$", "i");
    const match = dateStr.match(regex);
    if (!match) return null;

    let day = 1,
        month = 0,
        year = 1970,
        hour = 0,
        minute = 0,
        second = 0;
    let isPM = false;

    match.slice(1).forEach((value, i) => {
        const token = tokenOrder[i];
        switch (token) {
            case "d":
            case "dd":
                day = parseInt(value);
                break;
            case "M":
            case "MM":
                month = parseInt(value) - 1;
                break;
            case "MMM":
                month = shortMonths.indexOf(value);
                break;
            case "MMMM":
                month = months.indexOf(value);
                break;
            case "yy":
                year = 2000 + parseInt(value);
                break;
            case "yyyy":
                year = parseInt(value);
                break;
            case "h":
            case "hh":
            case "H":
            case "HH":
                hour = parseInt(value);
                break;
            case "m":
            case "mm":
                minute = parseInt(value);
                break;
            case "s":
            case "ss":
                second = parseInt(value);
                break;
            case "tt":
            case "TT":
                isPM = value.toUpperCase() === "PM";
                break;
        }
    });

    if (tokenOrder.includes("tt") || tokenOrder.includes("TT")) {
        if (hour === 12) hour = isPM ? 12 : 0;
        else hour = isPM ? hour + 12 : hour;
    }

    return new Date(year, month, day, hour, minute, second);
}

export function formatTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);

    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return `${interval} ${unit}${interval === 1 ? "" : "s"} ago`;
        }
    }

    // return "Just now";
    if (seconds > 0 && seconds < 60) {
        return `${seconds} seconds ago`;
    } else {
        return "Just now";
    }
}

export function formatTimeAgoz(date) {
    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
        return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds";
}