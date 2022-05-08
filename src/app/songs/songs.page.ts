import { QuranService } from './../services/quran.service';
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable radix */
/* eslint-disable eqeqeq */
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonRange } from '@ionic/angular';
@Component({
  selector: 'app-songs',
  templateUrl: './songs.page.html',
  styleUrls: ['./songs.page.scss'],
})
export class SongsPage implements OnInit {
  audio = [];
  songs = [
    {
      title: 'سورة الملك',
      subtitle: 'الشيخ مشاري',
      img: '/assets/photos/الملك.jpg',
      path: '/assets/surahs/الملك.mp3'
    },
    {
      title: 'سورة القلم',
      subtitle: 'الشيخ مشاري',
      img: '/assets/photos/القلم.jpg',
      path: '/assets/surahs/القلم.mp3'
    },
    {
      title: 'سورة الحاقة',
      subtitle: 'الشيخ مشاري',
      img: '/assets/photos/الحاقة.jpg',
      path: '/assets/surahs/الحاقة.mp3'
    },
    {
      title: 'سورة المعارج',
      subtitle: 'الشيخ مشاري',
      img: '/assets/photos/المعارج.jpg',
      path: '/assets/surahs/المعارج.mp3'
    },
    {
      title: 'سورة نوح',
      subtitle: 'الشيخ مشاري',
      img: '/assets/photos/نوح.jpg',
      path: '/assets/surahs/نوح.mp3'
    },
    {
      title: 'سورة الجن',
      subtitle: 'الشيخ مشاري',
      img: '/assets/photos/الجن.jpg',
      path: '/assets/surahs/الجن.mp3'
    },
    {
      title: 'سورة المزمل',
      subtitle: 'الشيخ مشاري',
      img: '/assets/photos/المزمل.jpg',
      path: '/assets/surahs/المزمل.mp3'
    },
    {
      title: 'سورة المدثر',
      subtitle: 'الشيخ مشاري',
      img: '/assets/photos/المدثر.jpg',
      path: '/assets/surahs/المدثر.mp3'
    },
    {
      title: 'سورة القيامة',
      subtitle: 'الشيخ مشاري',
      img: '/assets/photos/القيامة.jpg',
      path: '/assets/surahs/القيامة.mp3'
    },
    {
      title: 'سورة الإنسان',
      subtitle: 'الشيخ مشاري',
      img: '/assets/photos/الإنسان.jpg',
      path: '/assets/surahs/الإنسان.mp3'
    },
    {
      title: 'سورة المرسلات',
      subtitle: 'الشيخ مشاري',
      img: '/assets/photos/المرسلات.jpg',
      path: '/assets/surahs/المرسلات.mp3'
    },
  ];

  @ViewChild('range', { static: false }) range: IonRange;

  //Current song details
  currTitle: string;
  currSubtitle: string;
  currImage: string;

  //progress bar value
  progress = 0;

  //toggle for play/pause button
  isPlaying = false;

  //track of ion-range touch
  isTouched = false;

  //ion range texts
  currSecsText: string;
  durationText: string;

  //ion range value
  currRangeTime: number;
  maxRangeValue: number;

  //Current song
  currSong: HTMLAudioElement;

  //Upnext song details
  upNextImg: string;
  upNextTitle: string;
  upNextSubtitle: string;

  constructor(private quranAudio: QuranService) { }

  ngOnInit() {
    // this.quranAudio.getAudioSurahs().subscribe(result => {
    //   this.songs = result.data;
    //   console.log(this.songs);
    // });
  }

  sToTime(t) {
    return this.padZero(parseInt(String((t / (60)) % 60), 10)) + ':' +
      this.padZero(parseInt(String((t) % 60)));
  }

  padZero(v) {
    return (v < 10) ? '0' + v : v;
  }

  playSong(title, subTitle, img, song) {
    if (this.currSong != null) {
      this.currSong.pause();     //If a song plays,stop that
    }

    //open full player view
    document.getElementById('fullPlayer').style.bottom = '0px';
    //set current song details
    this.currTitle = title;
    this.currSubtitle = subTitle;
    this.currImage = img;

    //Current song audio
    this.currSong = new Audio(song);

    this.currSong.play().then(() => {
      //Total song duration
      this.durationText = this.sToTime(this.currSong.duration);
      //set max range value (important to show proress in ion-range)
      this.maxRangeValue = Number(this.currSong.duration.toFixed(2).toString().substring(0, 5));

      //set upnext song
      //get current song index
      const index = this.songs.findIndex(x => x.title == this.currTitle);
      //if current song is the last one then set first song info for upnext song
      if ((index + 1) == this.songs.length) {
        this.upNextImg = this.songs[0].img;
        this.upNextTitle = this.songs[0].title;
        this.upNextSubtitle = this.songs[0].subtitle;
      }

      //else set next song info for upnext song
      else {
        this.upNextImg = this.songs[index + 1].img;
        this.upNextTitle = this.songs[index + 1].title;
        this.upNextSubtitle = this.songs[index + 1].subtitle;
      }
      this.isPlaying = true;
    });

    this.currSong.addEventListener('timeupdate', () => {

      //update some infos as song plays on
      //if ion-range not touched the do update
      if (!this.isTouched) {

        //update ion-range value
        this.currRangeTime = Number(this.currSong.currentTime.toFixed(2).toString().substring(0, 5));
        //update current seconds text
        this.currSecsText = this.sToTime(this.currSong.currentTime);
        //update progress bar (in miniize view)
        this.progress = (Math.floor(this.currSong.currentTime) / Math.floor(this.currSong.duration));


        //if song ends,play next song
        if (this.currSong.currentTime == this.currSong.duration) {
          this.playNext();
        }
      }
    });
  }

  playNext() {
    const index = this.songs.findIndex(x => x.title == this.currTitle);

    if ((index + 1) == this.songs.length) {
      this.playSong(this.songs[0].title, this.songs[0].subtitle, this.songs[0].img, this.songs[0].path);
    }
    else {
      const nextIndex = index + 1;
      this.playSong(this.songs[nextIndex].title, this.songs[nextIndex].subtitle, this.songs[nextIndex].img, this.songs[nextIndex].path);
    }
  }

  playPrev() {
    const index = this.songs.findIndex(x => x.title == this.currTitle);

    if (index == 0) {
      const lastIndex = this.songs.length - 1;
      this.playSong(this.songs[lastIndex].title, this.songs[lastIndex].subtitle, this.songs[lastIndex].img, this.songs[lastIndex].path);
    }
    else {
      const prevIndex = index - 1;
      this.playSong(this.songs[prevIndex].title, this.songs[prevIndex].subtitle, this.songs[prevIndex].img, this.songs[prevIndex].path);
    }
  }

  touchStart() {
    this.isTouched = true;
    this.currRangeTime = Number(this.range.value);
  }

  touchMove() {
    this.currSecsText = this.sToTime(this.range.value);
  }

  touchEnd() {
    this.isTouched = false;
    this.currSong.currentTime = Number(this.range.value);
    this.currSecsText = this.sToTime(this.currSong.currentTime);
    this.currRangeTime = Number(this.currSong.currentTime.toFixed(2).toString().substring(0, 5));

    if (this.isPlaying) {
      this.currSong.play();
    }
  }

  maximize() {
    document.getElementById('fullPlayer').style.bottom = '0px';
    document.getElementById('miniPlayer').style.bottom = '-100px';
  }

  minimize() {
    document.getElementById('fullPlayer').style.bottom = '-1000px';
    document.getElementById('miniPlayer').style.bottom = '0px';
  }

  pause() {
    this.currSong.pause();
    this.isPlaying = false;
  }

  play() {
    this.currSong.play();
    this.isPlaying = true;
  }

  cancel() {
    document.getElementById('miniPlayer').style.bottom = '-100px';
    this.currImage = '';
    this.currTitle = '';
    this.currSubtitle = '';
    this.progress = 0;
    this.currSong.pause();
    this.isPlaying = false;
  }
}
