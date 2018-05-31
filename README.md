# countries-datamap

> World countries datamaps component for Angular, based on [DiMarco's Datamaps](https://github.com/markmarkoh/datamaps)

[![npm version](https://badge.fury.io/js/countries-map.svg)](https://badge.fury.io/js/countries-map)

## Table of contents

* [Install](#install)
* [Usage](#usage)
* [Attributes](#attributes)
* [Tooltip](#tooltip)
* [License](#license)


## Install

```bash
npm install --save countries-datamap
```

## Usage

Import `CountriesMapModule` in your `app.module.ts`:
```ts
import { CountriesMapModule } from 'countries-datamap';

@NgModule({
  ...
  imports: [
    ...
    CountriesMapModule,
  ],
})
export class AppModule { }
```

In your templates, use the `<countries-datamap>` component like this:
```html
<countries-datamap [srcData]="mapData"></countries-datamap>
```
and in the corresponding `.ts` file:
```ts
import { CountriesData } from 'countries-datamap';
...
public mapData: CountriesData = {
  'ES': { 'value': 416 },
  'GB': { 'value': 94 },
  'FR': { 'value': 255 }
};
```

### Typing

Typing the data input with `CountriesData` is not mandatory but it is highly recommendable because it will help you correctly define the object to pass to `<countries-datamap>`'s `[srcData]` attribute.

## Attributes

Element `<countries-datamap>` accepts the following attributes/inputs:

Attribute | Type | Default | Mandatory
--- | --- | --- | ---
srcData | CountriesData (object) | - | Yes
valueLabel | string | `'Times'` | No
showDataTooltip | boolean | `true` | No
multiUser | boolean | `true` | No
defaultColor | string | `'#428BCA'` | No
noDataColor | string | `'#AFAFAF'` | No
exceptionColor | string | `'#5CB85C'` | No

## Tooltip

Whenever you *hover* or tap a country, you will get a caption tooltip with the country's name. You can configure it to show additional data or not using `showDataTooltip`.

*Work in progress*


## License

[MIT](LICENSE.md)
