# Utils

## Installation

```bash
yarn add @friendsoftheweb/utils
```

## Functions

### Async

#### delay

Delay execution for a specified number of milliseconds.

```typescript
import { delay } from '@friendsoftheweb/utils';

await delay(1000); // Wait for 1 second
```

### CSV

#### createCSVStream

Creates a ReadableStream that generates CSV data from an async generator of
rows.

```typescript
import { createCSVStream } from '@friendsoftheweb/utils';

async function* getRows() {
  yield ['Name', 'Age', 'Email'];
  yield ['John', 30, 'john@example.com'];
  yield ['Jane', 25, 'jane@example.com'];
}

const stream = createCSVStream(getRows, {
  dateFormat: new Intl.DateTimeFormat('en-US'),
  reportError: (error) => console.error('CSV Error:', error),
});
```

#### serializeCSVCell

Serializes a single CSV cell value to a properly escaped string.

```typescript
import { serializeCSVCell } from '@friendsoftheweb/utils';

serializeCSVCell('Simple text'); // "Simple text"
serializeCSVCell('Text with "quotes"'); // "Text with ""quotes"""
serializeCSVCell('Text, with, commas'); // "Text, with, commas"
serializeCSVCell(42); // "42"
serializeCSVCell(true); // "true"
serializeCSVCell(new Date('2024-01-01')); // "January 1, 2024"
```

#### serializeCSVRow

Serializes an array of CSV cell values to a CSV row string.

```typescript
import { serializeCSVRow } from '@friendsoftheweb/utils';

serializeCSVRow(['Name', 'Age', 'Active']); // "Name,Age,Active\n"
serializeCSVRow(['John', 30, true]); // "John,30,true\n"
```

### Encryption

#### createEncryptValue

Creates a function that encrypts strings using AES-256-CTR encryption.

```typescript
import { createEncryptValue } from '@friendsoftheweb/utils/node';

const encryptValue = createEncryptValue({
  algorithm: 'aes-256-ctr',
  encryptionKey: 'your-32-byte-encryption-key-here',
});

const encrypted = encryptValue('secret data'); // Returns: { iv: 'hex-string', content: 'hex-string' }
```

#### createDecryptValue

Creates a function that decrypts values encrypted by `createEncryptValue`.

```typescript
import { createDecryptValue } from '@friendsoftheweb/utils/node';

const decryptValue = createDecryptValue({
  algorithm: 'aes-256-ctr',
  encryptionKey: 'your-32-byte-encryption-key-here',
});

const decrypted = decryptValue(encrypted); // Returns: 'secret data'
```

### Environment

#### getEnvBoolean

Get a boolean value from an environment variable with optional default.

```typescript
import { getEnvBoolean } from '@friendsoftheweb/utils/node';

const isEnabled = getEnvBoolean('FEATURE_ENABLED'); // Throws if not set
const isDebug = getEnvBoolean('DEBUG', false); // Returns false if not set
```

#### getEnvInteger

Get a numeric value from an environment variable with optional default.

```typescript
import { getEnvInteger } from '@friendsoftheweb/utils/node';

const port = getEnvInteger('PORT'); // Throws if not set
const timeout = getEnvInteger('TIMEOUT', 30000); // Returns 30000 if not set
```

#### getEnvString

Get a string value from an environment variable with optional default.

```typescript
import { getEnvString } from '@friendsoftheweb/utils/node';

const apiUrl = getEnvString('API_URL'); // Throws if not set
const environment = getEnvString('NODE_ENV', 'development'); // Returns 'development' if not set
```

### Formatting

#### formatDateForDateInput

Format a date or date string for use in a "date" input.

```typescript
import { formatDateForDateInput } from '@friendsoftheweb/utils';

formatDateForDateInput(new Date('2024-01-15'), { timeZone: 'UTC' }); // "2024-01-15"

formatDateForDateInput('2024-01-15T10:30:00Z', {
  timeZone: 'America/New_York',
}); // "2024-01-15"

formatDateForDateInput(null, { timeZone: 'UTC' }); // "" (empty string for invalid dates)
```

You can also create a version of the function with options pre-specified:

```typescript
import { createFormatDateForDateInput } from '@friendsoftheweb/utils';

const formatDateForDateInput = createFormatDateForDateInput({
  timeZone: 'America/New_York',
});

formatDateForDateInput('2024-01-15T10:30:00Z'); // "2024-01-15"
```

#### formatDateForDateTimeInput

Format a date or date string for use in a "datetime-local" input.

```typescript
import { formatDateForDateTimeInput } from '@friendsoftheweb/utils';

formatDateForDateTimeInput(new Date('2024-01-15T10:30:00Z'), {
  timeZone: 'UTC',
}); // "2024-01-15T10:30"

formatDateForDateTimeInput('2024-01-15T10:30:00Z', {
  timeZone: 'America/New_York',
}); // "2024-01-15T05:30"

formatDateForDateTimeInput(undefined, { timeZone: 'UTC' }); // "" (empty string for invalid dates)
```

You can also create a version of the function with options pre-specified:

```typescript
import { createFormatDateForDateTimeInput } from '@friendsoftheweb/utils';

const formatDateForDateTimeInput = createFormatDateForDateTimeInput({
  timeZone: 'America/New_York',
});

formatDateForDateTimeInput('2024-01-15T10:30:00Z'); // "2024-01-15T05:30"
```

#### formatDuration

Format a duration in seconds to a string in the format "HH:MM:SS" or "MM:SS".

```typescript
import { formatDuration } from '@friendsoftheweb/utils';

formatDuration(30); // "00:30"
formatDuration(125); // "02:05"
formatDuration(3665); // "01:01:05"
```

#### formatFileSize

Format a file size in bytes into a human-readable string using decimal SI units.

```typescript
import { formatFileSize } from '@friendsoftheweb/utils';

formatFileSize(1000); // "1 KB"
formatFileSize(1500000); // "1.5 MB"
formatFileSize(2000000000); // "2 GB"
formatFileSize(-100); // Throws error: "File size cannot be negative"
```

#### formatValue

Formats a numeric value with optional order-of-magnitude abbreviation and unit.

```typescript
import { formatValue } from '@friendsoftheweb/utils';

// Basic formatting
formatValue(1234567); // "1,234,567"
formatValue(null); // null

// With abbreviation
formatValue(1500000, { abbreviate: true }); // "1.5M"
formatValue(2500, { abbreviate: true }); // "2.5K"

// With units
formatValue(100, { unit: 'px' }); // "100 px"
formatValue(75, { unit: '%' }); // "75%" (no space for percentages)

// With significant figures
formatValue(3.14159, { maximumFractionDigits: 2 }); // "3.14"

// With locale
formatValue(1234.56, { locales: 'de-DE' }); // "1.234,6"

// Combined options
formatValue(2500000, {
  abbreviate: true,
  unit: 'users',
  maximumFractionDigits: 2,
}); // "2.5M users"
```

You can also create a version of the function with default options specified:

```typescript
import { createFormatValue } from '@friendsoftheweb/utils';

const formatUsers = createFormatValue({
  abbreviate: true,
  unit: 'users',
  maximumFractionDigits: 2,
});

formatUsers(2_500_000); // "2.5M users"
formatUsers(2_500_000, { abbreviate: false }); // "2,500,000 users"
```

### HTTP

#### buildContentDispositionHeader

Builds a Content-Disposition HTTP header for file downloads with proper filename
encoding and sanitization.

```typescript
import { buildContentDispositionHeader } from '@friendsoftheweb/utils';

// Basic attachment (default)
buildContentDispositionHeader('document.pdf');
// "attachment; filename="document.pdf"; filename*=UTF-8''document.pdf"

// Inline display (e.g., for images in browser)
buildContentDispositionHeader('image.jpg', { inline: true });
// "inline; filename="image.jpg"; filename*=UTF-8''image.jpg"

// Handles special characters and Unicode
buildContentDispositionHeader('résumé.pdf');
// "attachment; filename="résumé.pdf"; filename*=UTF-8''r%C3%A9sum%C3%A9.pdf"

// Sanitizes problematic characters
buildContentDispositionHeader('file"with;bad\\chars.txt');
// "attachment; filename="file_with_bad_chars.txt"; filename*=UTF-8''file%22with%3Bbad%5Cchars.txt"
```

### Language

#### slugify

Creates URL-friendly slugs from text by removing diacritics, normalizing special
characters, and converting to lowercase with hyphens.

```typescript
import { slugify } from '@friendsoftheweb/utils';

// Basic usage
slugify('Hello World'); // "hello-world"
slugify('My Blog Post Title'); // "my-blog-post-title"

// Handles diacritics and international characters
slugify('Café résumé naïve'); // "cafe-resume-naive"
slugify('München Zürich'); // "munchen-zurich"
slugify('São Paulo'); // "sao-paulo"

// Special character replacement
slugify('Cats & Dogs'); // "cats-and-dogs"
slugify('C++ Programming'); // "c-plus-plus-programming"
slugify('50% Off Sale'); // "50-percent-off-sale"
slugify('API v2.0'); // "api-v2-dot-0"
slugify('2 + 2 = 4'); // "2-plus-2-equals-4"
slugify('Price/Quality Ratio'); // "price-slash-quality-ratio"
```

#### transliterate

Removes diacritical marks (accents) from Latin characters while preserving the
base letters.

```typescript
import { transliterate } from '@friendsoftheweb/utils';

// Basic usage
transliterate('café'); // "cafe"
transliterate('résumé'); // "resume"
transliterate('naïve'); // "naive"

// Handles various languages
transliterate('français'); // "francais"
transliterate('Mädchen'); // "Madchen"
transliterate('niño'); // "nino"
transliterate('São Paulo'); // "Sao Paulo"

// Preserves case and structure
transliterate('José María García'); // "Jose Maria Garcia"
transliterate('CAFÉ RÉSUMÉ'); // "CAFE RESUME"
transliterate('The café serves crêpes'); // "The cafe serves crepes"

// Special character handling
transliterate('Straße'); // "Strasse" (German ß becomes ss)
transliterate('Æon'); // "AEon" (Æ becomes AE)
```

### Time

#### seconds

Converts a duration in seconds to milliseconds.

```typescript
import { seconds } from '@friendsoftheweb/utils';

seconds(30); // 30000 (milliseconds)
setTimeout(callback, seconds(5)); // Wait 5 seconds
```

#### minutes

Converts a duration in minutes to milliseconds.

```typescript
import { minutes } from '@friendsoftheweb/utils';

minutes(5); // 300000 (milliseconds)
setTimeout(callback, minutes(2)); // Wait 2 minutes
```

#### hours

Converts a duration in hours to milliseconds.

```typescript
import { hours } from '@friendsoftheweb/utils';

hours(1); // 3600000 (milliseconds)
setTimeout(callback, hours(1)); // Wait 1 hour
```

#### days

Converts a duration in days to milliseconds.

```typescript
import { days } from '@friendsoftheweb/utils';

days(1); // 86400000 (milliseconds)
const expirationTime = Date.now() + days(7); // Expires in 7 days
```

### Transformation

#### deepTransformKeys

Recursively transforms all object keys in a nested data structure using a
provided transformation function. Also includes curried convenience functions.

```typescript
import {
  deepTransformKeys,
  deepCamelCaseKeys,
  deepPascalCaseKeys,
} from '@friendsoftheweb/utils';

const data = {
  user_name: 'John',
  user_profile: {
    email_address: 'john@example.com',
    contact_info: {
      phone_number: '123-456-7890',
    },
  },
};

// Custom transformation
const upperCased = deepTransformKeys((key) => key.toUpperCase(), data);
// Result: { USER_NAME: 'John', USER_PROFILE: { EMAIL_ADDRESS: '...', ... } }

// Built-in transformations
const camelCased = deepCamelCaseKeys(data);
// Result: { userName: 'John', userProfile: { emailAddress: '...', ... } }

const pascalCased = deepPascalCaseKeys(data);
// Result: { UserName: 'John', UserProfile: { EmailAddress: '...', ... } }

// Curried usage
const toCamelCase = deepTransformKeys(camelCase);
const transformedArray = apiData.map(toCamelCase);
```

#### parseDelimitedString

Parses a delimited string into an array of values, with optional transformation.
Filters out empty or null values.

**NOTE:** Any special regex characters used as delimiters must be escaped (e.g.
`'\\|'` instead of `'|'`).

```typescript
import { parseDelimitedString } from '@friendsoftheweb/utils';

// Basic comma-separated parsing
parseDelimitedString('a, b, c'); // ['a', 'b', 'c']

// Handles whitespace around delimiters
parseDelimitedString('  one  ,  two  ,  three  '); // ['one', 'two', 'three']

// Filters out empty values
parseDelimitedString('a,,b,'); // ['a', 'b']

// Custom delimiter
parseDelimitedString('a|b|c', { delimiter: '|' }); // ['a', 'b', 'c']
parseDelimitedString('a;b;c', { delimiter: ';' }); // ['a', 'b', 'c']

// Custom transformation
parseDelimitedString('1,2,3', {
  transformValue: parseInt,
}); // [1, 2, 3]

// Transform with filtering (null values are excluded)
parseDelimitedString('1,abc,3', {
  transformValue: (value) => {
    const number = parseInt(value);

    return Number.isNaN(number) ? null : number;
  },
}); // [1, 3]
```

#### parseNullableDate

Parses various date inputs into TZDate objects with timezone support, returning
null for invalid inputs.

```typescript
import { parseNullableDate } from '@friendsoftheweb/utils';
import { TZDate } from '@date-fns/tz';

// Parse date strings
parseNullableDate('2024-01-15', { timeZone: 'America/New_York' }); // TZDate instance
parseNullableDate('2024-01-15T10:30', { timeZone: 'UTC' }); // TZDate instance

// Handle existing dates
const existingDate = new TZDate(2024, 0, 15, 'UTC');
parseNullableDate(existingDate, { timeZone: 'America/New_York' }); // Returns same TZDate

// Handle invalid inputs
parseNullableDate('invalid-date', { timeZone: 'UTC' }); // null
parseNullableDate(null, { timeZone: 'UTC' }); // null
parseNullableDate(undefined, { timeZone: 'UTC' }); // null
```

You can also create a version of the function with options pre-specified:

```typescript
import { createParseNullableDate } from '@friendsoftheweb/utils';

const parseNullableDate = createParseNullableDate({
  timeZone: 'America/New_York',
});

parseNullableDate('2024-01-15'); // TZDate instance
parseNullableDate(null); // null
```

#### parseNullableFloat

Parses string values to floating-point numbers, returning `null` for invalid or
`null`/`undefined` inputs.

```typescript
import { parseNullableFloat } from '@friendsoftheweb/utils';

parseNullableFloat('3.14159'); // 3.14159
parseNullableFloat('42'); // 42
parseNullableFloat('-123.45'); // -123.45
parseNullableFloat('1.5e10'); // 15000000000
parseNullableFloat('Infinity'); // Infinity

// Invalid inputs return null
parseNullableFloat('not-a-number'); // null
parseNullableFloat(null); // null
parseNullableFloat(undefined); // null
```

#### parseNullableInt

Parses string values to integers, returning `null` for invalid or
`null`/`undefined` inputs.

```typescript
import { parseNullableInt } from '@friendsoftheweb/utils';

parseNullableInt('42'); // 42
parseNullableInt('-123'); // -123
parseNullableInt('3.14'); // 3 (truncated)
parseNullableInt('42abc'); // 42 (parses leading digits)

// Invalid inputs return null
parseNullableInt('not-a-number'); // null
parseNullableInt(null); // null
parseNullableInt(undefined); // null
```

#### presence

Returns the input value when it is considered "present", otherwise `null`.

```typescript
import { presence } from '@friendsoftheweb/utils';

// Present values
presence('hello'); // "hello"
presence(42); // 42
presence(true); // true
presence([1, 2, 3]); // [1, 2, 3]
presence({ key: 'value' }); // { key: 'value' }

// Non-present values return null
presence(''); // null (empty string)
presence('   '); // null (whitespace only)
presence(NaN); // null (invalid number)
presence([]); // null (empty array)
presence({}); // null (empty object)
presence(null); // null
presence(undefined); // null
```

### Validation

#### isPresent

Type guard that determines whether a value is "present" based on type-specific
checks.

```typescript
import { isPresent } from '@friendsoftheweb/utils';

// Type guard usage
function processValue(value: string | null | undefined) {
  if (isPresent(value)) {
    // TypeScript knows value is string here
    console.log(value.toUpperCase());
  }
}

// Examples
isPresent('hello'); // true
isPresent(''); // false (empty string)
isPresent(42); // true
isPresent(NaN); // false (invalid number)
isPresent([1, 2]); // true
isPresent([]); // false (empty array)
isPresent({ key: 'value' }); // true
isPresent({}); // false (empty object)
isPresent(null); // false
isPresent(undefined); // false
```

#### isPresentNumber

Type guard that checks if a value is a valid, present number.

```typescript
import { isPresentNumber } from '@friendsoftheweb/utils';

isPresentNumber(42); // true
isPresentNumber(-3.14); // true
isPresentNumber(0); // true
isPresentNumber(Infinity); // true

isPresentNumber(NaN); // false
isPresentNumber('42'); // false (string, not number)
isPresentNumber(null); // false
```

#### isPresentString

Type guard that checks if a value is a non-empty string with meaningful content.

```typescript
import { isPresentString } from '@friendsoftheweb/utils';

isPresentString('hello'); // true
isPresentString('  text  '); // true (has non-whitespace content)

isPresentString(''); // false (empty)
isPresentString('   '); // false (only whitespace)
isPresentString('\t\n'); // false (only whitespace)
isPresentString(42); // false (not a string)
isPresentString(null); // false
```

### Types

The library also exports TypeScript types for better development experience:

- `JSONValue` - Represents any JSON-serializable value
- `JSONObject` - Represents a JSON object
- `TimeZone` - Supported timezone strings
- `CSVCell` - Valid CSV cell value types
- `CreateCSVStreamOptions` - Options for CSV stream creation
