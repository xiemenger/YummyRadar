import { Component, OnInit, ViewChild } from '@angular/core';
import { AnalysisService } from '../../Services/analysis.service';
import { GeoInfoService } from '../../Services/geo-info.service';
import { Location } from '../../Models/location.model';
import { NgForm } from '@angular/forms';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-analysis-location',
  templateUrl: './analysis-location.component.html',
  styleUrls: ['./analysis-location.component.scss'],
})
export class AnalysisLocationComponent implements OnInit {
  @ViewChild('f') locationForm: NgForm;

  private location: Location = {
    state: '',
    city: '',
    zipCode: '',
    reviewCount: 0,
    stars: 0,
  };
  private chart = [];

  constructor(
    private _analysisService: AnalysisService,
    private _geoInfoService: GeoInfoService
  ) {}

  stateOptions = ["IL", "WI", "SC"];
  cities: string[] = [];
  zipCodes: number[] = [];
  selectedState = "IL";
  ngOnInit() {}

  onSelectState(stateName:  string) {
    this.selectedState = this.locationForm.controls['selectedState'].value;
    this.cities = this._geoInfoService.getCities(this.selectedState);
    this.zipCodes = this._geoInfoService.getZipCodes(this.selectedState);
  }


  onSubmitSelection() {
    this.location.state = this.locationForm.value.selectedState;
    this.location.city = this.locationForm.value.selectedCity;
    this.location.zipCode = this.locationForm.value.selectedZipCode;
    this.location.reviewCount = this.locationForm.value.selectedReviewCount;
    this.location.stars = this.locationForm.value.selectedStars;

    this._analysisService.getBusinesses(this.location)
      .subscribe(
          (data: any) => {
            let categories = data.categories;
            let numbers = data.counts;
            if (categories.length > 0) {
              this.chart = new Chart('pie-chart-canvas', {
                type: 'pie',
                data: {
                  datasets: [
                    {
                      data: numbers,
                      borderColor: '#ffcc00',
                      backgroundColor: ["#0074D9", "#FF4136", "#2ECC40", "#FF851B", "#7FDBFF", "#B10DC9", "#FFDC00", "#001f3f", "#39CCCC", "#01FF70", "#85144b", "#F012BE", "#3D9970", "#111111", "#AAAAAA"],
                      fill: true
                    }
                  ],
                  labels:categories
                },
                options: {
                  responsive: true,
                  scaleOverride:true,
                  scaleSteps:10,
                  scaleStartValue:0,
                  scaleStepWidth:1,
                  title: {
                    display: true,
                    text: "Number of Differet Restaurants"
                  }
                }
              })
            } else {
              alert("Oops, there is no matching data");
            }
            this.locationForm.reset();
            this.chart = null;
          },
          (error) => console.log(error)
        );
  }
}
