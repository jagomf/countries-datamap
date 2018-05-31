import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import 'datamaps';

const DEFAULT_WIDTH = 500;
const SIZE_FACTOR = 0.42;
const COUNTRY = { MINE: 'mycountry', SELECTED: 'selected' };

@Component({
  selector: 'countries-datamap',
  templateUrl: './countries-datamap.component.html',
  styleUrls: ['./countries-datamap.component.css']
})
export class CountriesDatamapComponent implements OnInit {
  @Input() srcData: any[] = [];
  @Input() noDataColor = '#afafaf';
  @Input() defaultColor = '#428bca';
  @Input() exceptionColor = '#5cb85c';
  @Input() valueLabel = 'Times';
  @Input() multiUser = true;
  @Input() showDataTooltip = true;

  processedData: object;
  renderedMap: DataMap;

  constructor(private mapContainer: ElementRef) {
    this.processedData = {};
  }

  generateMap() {
    this.srcData.forEach(flagoccurrence => {
      if (!this.multiUser) {
        if (flagoccurrence.users[0].isSelfCountry) {
          this.processedData[flagoccurrence.iso3] = {
            fillKey: COUNTRY.MINE,
            users: [{ showTimes: false }]
          };
        } else {
          this.processedData[flagoccurrence.iso3] = {
            fillKey: COUNTRY.SELECTED,
            users: [{ showTimes: true, times: flagoccurrence.users[0].times }]
          };
        }
      } else {
        let isHomeCountry = true;
        const usersInThisFlag = [];

        // sort this flag by times. if self country, counts much less
        flagoccurrence.users.sort(flagUser => {
          return flagUser.isSelfCountry
            ? flagUser.times
            : flagUser.times * 1000;
        });

        // collect users data and see if it is self country for all (cause it'll get different color)
        flagoccurrence.users.forEach(flagUser => {
          isHomeCountry = isHomeCountry && flagUser.isSelfCountry;
          usersInThisFlag.push({
            name: flagUser.name,
            surname: flagUser.surname,
            showTimes: !flagUser.isSelfCountry,
            times: flagUser.times
          });
        });

        this.processedData[flagoccurrence.iso3] = {
          users: usersInThisFlag,
          fillKey: isHomeCountry ? COUNTRY.MINE : COUNTRY.SELECTED
        };
      }
    });

    const availableWidth =
      this.mapContainer.nativeElement.parentNode.offsetWidth > 0
        ? this.mapContainer.nativeElement.parentNode.parentNode.offsetWidth
        : DEFAULT_WIDTH;
    const height = availableWidth * SIZE_FACTOR;

    // === START: DATAMAPS MAIN PART ===
    this.renderedMap = new DataMap({
      element: this.mapContainer.nativeElement,
      width: availableWidth,
      height,
      // projection: 'mercator',
      geographyConfig: {
        // geographyConfig object can be removed to restore hover effects
        highlightOnHover: false,
        popupTemplate: this.generateTooltip
      },
      fills: {
        defaultFill: this.noDataColor,
        selected: this.defaultColor,
        mycountry: this.exceptionColor
      },
      data: this.processedData
    });
    // === END: DATAMAPS MAIN PART ===
  }

  generateTooltip(geography, data) {
    let content = `<strong>${geography.properties.name}</strong>`;
    if (this.showDataTooltip && data) {
      if (!this.multiUser) {
        if (data.users[0].showTimes) {
          content = `${content}<br/>${this.valueLabel}: ${data.users[0].times}`;
        }
      } else {
        data.users.forEach(flagUser => {
          if (flagUser.showTimes) {
            content = `${content}<br/>
              ${flagUser.name} ${flagUser.surname}:
              <strong>x${flagUser.times}</strong>`;
          } else {
            content = `${content}<br/>
              ${flagUser.name} ${flagUser.surname} (self country)`;
          }
        });
      }
    }
    return `<div class="hoverinfo">${content}</div>`;
  }

  ngOnInit() {
    this.generateMap();
  }
}
