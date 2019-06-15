import {AfterViewInit, Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import {Observable, of, Subject, timer} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {AzureService} from "../../core/services/azure.service";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as moment from 'moment';
import {tick} from "@angular/core/testing";
import {map, takeWhile} from "rxjs/operators";

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.sass']
})
export class CameraComponent implements OnInit, AfterViewInit, OnDestroy {

  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  alive = false;
  emotions: FaceAttributes[] = [];
  avg: FaceAttributes;
  public errors: WebcamInitError[] = [];
  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  private chart: am4charts.XYChart;

  constructor(private http: HttpClient,
              private zone: NgZone,
              private azure: AzureService) {
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  renderChart(data: FaceAttributes[], avg) {
    let chart = am4core.create("chartdiv", am4charts.XYChart);

    chart.data = data.map(value => value.emotion);
    console.log(chart.data)

// Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "date";
    categoryAxis.title.text = "date";

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "Neutral";

    var series1 = chart.series.push(new am4charts.LineSeries());
    series1.name = "neutral";
    series1.stroke = am4core.color("#CDA2AB");
    series1.strokeWidth = 3;
    series1.dataFields.valueY = "neutral";
    series1.dataFields.categoryX = "date";

    var series2 = chart.series.push(new am4charts.LineSeries());
    series2.name = "happiness";
    series2.stroke = am4core.color("#63cd25");
    series2.strokeWidth = 3;
    series2.dataFields.valueY = "happiness";
    series2.dataFields.categoryX = "date";

    var series3 = chart.series.push(new am4charts.LineSeries());
    series3.name = "anger";
    series3.stroke = am4core.color("#cd0001");
    series3.strokeWidth = 3;
    series3.dataFields.valueY = "anger";
    series3.dataFields.categoryX = "date";

    var series4 = chart.series.push(new am4charts.LineSeries());
    series4.name = "sadness";
    series4.stroke = am4core.color("#cd7d24");
    series4.strokeWidth = 3;
    series4.dataFields.valueY = "sadness";
    series4.dataFields.categoryX = "date";

    var series5 = chart.series.push(new am4charts.LineSeries());
    series5.name = "surprise";
    series5.stroke = am4core.color("#1b17cd");
    series5.strokeWidth = 3;
    series5.dataFields.valueY = "surprise";
    series5.dataFields.categoryX = "date";

    var series6 = chart.series.push(new am4charts.LineSeries());
    series6.name = "contempt";
    series6.stroke = am4core.color("#cdb767");
    series6.strokeWidth = 3;
    series6.dataFields.valueY = "contempt";
    series6.dataFields.categoryX = "date";

    var series7 = chart.series.push(new am4charts.LineSeries());
    series7.name = "disgust";
    series7.stroke = am4core.color("#cdb900");
    series7.strokeWidth = 3;
    series7.dataFields.valueY = "disgust";
    series7.dataFields.categoryX = "date";

    var series8 = chart.series.push(new am4charts.LineSeries());
    series8.name = "fear";
    series8.stroke = am4core.color("#cd0068");
    series8.strokeWidth = 3;
    series8.dataFields.valueY = "fear";
    series8.dataFields.categoryX = "date";

    chart.cursor = new am4charts.XYCursor();

    chart.legend = new am4charts.Legend();
    this.chart = chart;

    this.renderPie(avg);
  }
  renderPie(data: FaceAttributes) {
    let chart = am4core.create("piechartdiv", am4charts.PieChart);
    chart.data = Object.keys(data.emotion).map(value => {
      if (value !== 'date') return {
        metrics: value,
        value: data.emotion[value]
      }
    });

    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "value";
    pieSeries.dataFields.category = "metrics";
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
    });
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }

  ngOnInit() {
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public handleImage(webcamImage: WebcamImage): void {
    let file = this.dataURLtoFile(webcamImage.imageAsDataUrl, 'newfile.jpeg');
    this.azure.sendToAzure(file).subscribe((value: any[]) => {
      let averageEmotions: FaceAttributes;
      let res: FaceAttributes[] = value.map(value => value.faceAttributes);
      averageEmotions = this.getAverage(res);

      this.emotions.push(averageEmotions);
      this.avg = this.getAverage(this.emotions);
      this.renderChart(this.emotions, this.avg);
    });
  }

  private getAverage(array: FaceAttributes[]) {
    return array.reduce((previousValue, currentValue): FaceAttributes => {
      return {
        age: (previousValue.age + currentValue.age) / 2,
        emotion: {
          date: moment().format('HH:mm:ss a'),
          anger: (previousValue.emotion.anger + currentValue.emotion.anger) / 2,
          contempt: (previousValue.emotion.contempt + currentValue.emotion.contempt) / 2,
          disgust: (previousValue.emotion.disgust + currentValue.emotion.disgust) / 2,
          fear: (previousValue.emotion.fear + currentValue.emotion.fear) / 2,
          happiness: (previousValue.emotion.happiness + currentValue.emotion.happiness) / 2,
          neutral: (previousValue.emotion.neutral + currentValue.emotion.neutral) / 2,
          sadness: (previousValue.emotion.sadness + currentValue.emotion.sadness) / 2,
          surprise: (previousValue.emotion.surprise + currentValue.emotion.surprise) / 2
        },
        gender: "male",
        smile:
          (currentValue.smile + currentValue.smile) / 2
      }
    }, array[0]);
  }

  private dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type: mime});
  }

  onStreamEnable() {
    this.alive = true;
    timer(0, 10000)
      .pipe(
        takeWhile(() => this.alive)
      )
      .subscribe(() => {
        console.log('hi')
        this.triggerSnapshot();
      });
  }

  onStreamDisable() {
    this.alive = false;
  }
}

export interface FaceAttributes {
  age: number;
  emotion: {
    date?: string;
    anger: number;
    contempt: number;
    disgust: number;
    fear: number;
    happiness: number;
    neutral: number;
    sadness: number;
    surprise: number;
  };
  smile: number;
  gender: 'male' | 'female';

}
