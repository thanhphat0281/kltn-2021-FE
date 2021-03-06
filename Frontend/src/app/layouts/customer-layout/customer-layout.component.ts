import { Component, OnInit } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { Router } from '@angular/router';
import { PointService } from 'src/app/app-services/point-service/point.service';
import { Point } from 'src/app/app-services/point-service/point.model';
import { DiscountCodeService } from 'src/app/app-services/discountCode-Service/discountCode.service';
import { CategoryService } from '../../app-services/category-service/category.service';
import { AuthorService } from '../../app-services/author-service/author.service';
import { DiscountCode } from 'src/app/app-services/discountCode-Service/discountCode.model';
import { Book } from '../../app-services/book-service/book.model';
import { Category } from '../../app-services/category-service/category.model';
import { Author } from '../../app-services/author-service/author.model';
import swal from 'sweetalert2';
import { UserService } from 'src/app/app-services/user-service/user.service';
import { AuthenticateService } from 'src/app/app-services/auth-service/authenticate.service';
import { BestService } from 'src/app/app-services/best-service/best.service';
import { SegmentService } from 'src/app/app-services/segment-service/segment.service';
declare var $: any;
declare let Winwheel: any
import { HostService } from 'src/app/app-services//aHost/Host.service';

@Component({
  selector: 'app-customer-layout',
  templateUrl: './customer-layout.component.html',
  styleUrls: ['./customer-layout.component.css']
})
export class CustomerLayoutComponent implements OnInit {

  accountSocial = JSON.parse(localStorage.getItem('accountSocial'));
  statusLogin = localStorage.getItem('statusLogin');
  loginBy = localStorage.getItem('loginBy');
  point: Point = new Point;
  discountCode: DiscountCode = new DiscountCode;
  pointCur: any;
  addPoint = 0;
  CartBook = [];
  TongTien = 0;
  TongCount = 0;
  lengthCartBook = 0;

  isLoggedIn = false
  role: string = ''
  isCustomer = false

  topCategory = []
  topAuthor = []
  constructor(private _router: Router, private userService: UserService, private authService: AuthenticateService,
    private segmentService: SegmentService, private bookCategoryService: CategoryService, private authorService: AuthorService,
    private _pointService: PointService, private _discountCode: DiscountCodeService, private _best: BestService,private _host:HostService) {

  }

  // baseURL = this._host.host();
  changespinner = "chocolate";
  segments: any
  segmentsList = [] 
  segmentIndex: {}
  ngOnInit() {
    $("#changewhell").css({'float':'right','width':'90px','background-color':this.changespinner});
    $("#color").css({'color':this.changespinner});

    this.getTotalCountAndPrice();
    this.authService.authInfo.subscribe(val => { 
      this.isLoggedIn = val.isLoggedIn;
      this.role = val.role;
      this.isCustomer = this.authService.isCustomer()
      this.accountSocial = JSON.parse(this.authService.getAccount())
    });
    this.getTop10CategoryAndAuthor()
    this.getallCategory()
    this.getAllAuthor()
    this.segmentService.getSegments().subscribe(res =>{
      this.segments = res as []
      this.segments.forEach(element => {
        if(element.isActive) {
          element.segments.forEach(element => { 
            this.segmentIndex = { 'fillStyle': element.fillStyle, 'text':  element.text }
            this.segmentsList.push(this.segmentIndex)
          });
        }
      });
      this.designWheel();
    })
  }

  getTop10CategoryAndAuthor() {
    this._best.getTop10CategoryAndAuthor().subscribe(
      top10 => {
        this.topCategory = top10["CategoryList"]
        this.topAuthor = top10["AuthorList"]
      }
    )
  }
  
  //get all category
  getallCategory(){
    this.bookCategoryService.getCategoryList().subscribe(res=>{
      this.bookCategoryService.categories = res as Category[]
    })
  }

  //get all Author
  getAllAuthor(){
    this.authorService.getAuthorList().subscribe(res=>{
      this.authorService.authors = res as Author[]
    })
  }
  //Show category
  showCategory(id: String) {
    var category: any;
    this.bookCategoryService.getCategoryById(id).subscribe((res) => {
      this.bookCategoryService.categories = res as Category[];
      category = res;
    });
  }

  // set ????? d??i c???a gi??? h??ng
	cartBookLength(CartBook) {
		if (CartBook == null) {
			this.lengthCartBook = 0;
		} else {
			this.lengthCartBook = CartBook.length;
		}
	}
	//get total count and price 
	getTotalCountAndPrice() {
		this.TongTien = 0;
		this.TongCount = 0;
		this.CartBook = JSON.parse(localStorage.getItem("CartBook"));
		this.cartBookLength(this.CartBook);
		if (this.CartBook != null) {
			for (var i = 0; i < this.lengthCartBook; i++) {
        this.TongTien += parseInt((parseInt(this.CartBook[i].priceBook) * parseInt(this.CartBook[i].count)*(100-this.CartBook[i].sale)/100).toFixed(0));
				this.TongCount += parseInt(this.CartBook[i].count);
			}
    }
    
		$('#tongtien').html("&nbsp;" + this.formatCurrency(this.TongTien.toString()));
		$('.cart_items').html(this.TongCount.toString());
		localStorage.setItem("TongTien", this.TongTien.toString());
		localStorage.setItem("TongCount", this.TongCount.toString());
	  }
	  //#endregion
	   formatCurrency(number){
		var n = number.split('').reverse().join("");
		var n2 = n.replace(/\d\d\d(?!$)/g, "$&,");    
		return  n2.split('').reverse().join('') + 'VN??';
	}
  designWheel() {
    let baseURL= this._host.host()
    //Th??ng s??? v??ng quay
    let duration = 5; //Th???i gian k???t th??c v??ng quay
    let spins = 15; //Quay nhanh hay ch???m 3, 8, 15
   console.log(this.segmentsList)
    let theWheel = new Winwheel({
        'numSegments': 12,     // Chia 12 ph???n b???ng nhau
        'outerRadius': 212,   // ?????t b??n k??nh v??ng quay
        'textFontSize': 18,    // ?????t k??ch th?????c ch???
        'rotationAngle': 0,     // ?????t g??c v??ng quay t??? 0 ?????n 360 ?????.
        'segments': this.segmentsList,    // C??c th??nh ph???n bao g???m m??u s???c v?? v??n b???n.
        'animation': {
          'type': 'spinToStop',
          'duration': duration,
          'spins': spins,
          'callbackSound': playSound,     //H??m g???i ??m thanh khi quay
          'soundTrigger': 'pin',         //Ch??? ?????nh ch??n l?? ????? k??ch ho???t ??m thanh
          'callbackFinished': alertPrize,    //H??m hi???n th??? k???t qu??? tr??ng gi???i th?????ng
        },
        'pins':
        {
          'number': 32   //S??? l?????ng ch??n. Chia ?????u xung quanh v??ng quay.
        }
      });
    
    var addPoint: any

    //Ki???m tra v??ng quay
    let wheelSpinning = false;

    //T???o ??m thanh v?? t???i t???p tin tick.mp3.
    let audio = new Audio('../../../assets/spinner/tick.mp3');
    function playSound() {
      audio.pause();
      audio.currentTime = 0;
      audio.play();
    }

    //Hi???n th??? c??c n??t v??ng quay
    function statusButton(status) {
      if (status == 1) { //tr?????c khi quay
        document.getElementById('spin_start').removeAttribute("disabled");
        document.getElementById('spin_reset').classList.add("hide");
      } else if (status == 2) { //??ang quay
        document.getElementById('spin_start').setAttribute("disabled", 'false');
        document.getElementById('spin_reset').classList.add("hide");
      } else if (status == 3) { //k???t qu???
        document.getElementById('spin_reset').classList.remove("hide");
      } else {
        alert('C??c gi?? tr??? c???a status: 1, 2, 3');
      }
    }
    statusButton(1);
    function minusPoint() {
      //t??ng point 
      $.ajax({
        type: "post",
        url: baseURL+'/points/updatePointByUserID',
        data: {
          userID: (JSON.parse(localStorage.getItem('accountSocial')))._id,
          point: -80
        },
        success: function (response) {
          $.get(baseURL+'/points/getPointByUserID/' + (JSON.parse(localStorage.getItem('accountSocial')))._id, function (data) {
            $("#pointcur").html(data[0].point + " ??i???m");
          });
        }
      });
    }
    //startSpin
    function startSpin() {
      $.get(baseURL+'/points/getPointByUserID/' + (JSON.parse(localStorage.getItem('accountSocial')))._id, function (data) {
        if (data[0].point >= 80) {
          // Ensure that spinning can't be clicked again while already running.
          if (wheelSpinning == false) {
            //CSS hi???n th??? button
            statusButton(2);
            //H??m b???t ?????u quay
            theWheel.startAnimation();
            //Kh??a v??ng quay
            wheelSpinning = true;
            minusPoint();
          }
        } else {
          swal.fire('B???n kh??ng ????? ??i???u ki???n ????? quay th?????ng');
        }
      });
    }
    //Result
    function alertPrize(indicatedSegment) {
      if (indicatedSegment.text == "Kh??ng c?? qu??") {

        swal.fire("Ch??c B???n May M???n L???n Sau");

      } else
        if (indicatedSegment.text[0] == "+") {
          var res = indicatedSegment.text.split(" ??i???m");
          var str = res[0].split("+");
          swal.fire("B???n ???????c C???ng Th??m " + str[1] + " ??i???m V??o T??i Kho???n");
          // ch???y d??ng n??y oke th?? ngon  
          addPoint = str[1];
          $.ajax({
            type: "post",
            url: baseURL+'/points/updatePointByUserID',
            data: {
              userID: (JSON.parse(localStorage.getItem('accountSocial')))._id,
              point: addPoint
            },
            success: function (response) {
              $.get(baseURL+'/points/getPointByUserID/' + (JSON.parse(localStorage.getItem('accountSocial')))._id, function (data) {
                $("#pointcur").html(data[0].point + " ??i???m");
              });
            }
          });
        } else {
          swal.fire("Ch??c M???ng B???n ???? Tr??ng " + indicatedSegment.text + " Cho To??n B??? ????n H??ng");
          var res = indicatedSegment.text.split(" ");
          var str = res[indicatedSegment.text.split(" ").length - 1];
          $.ajax({
            type: "post",
            url: baseURL+'/discountCodes',
            data: {
              userID: (JSON.parse(localStorage.getItem('accountSocial')))._id,
              discountCode: str.slice(0, -1),
              discountDetail: indicatedSegment.text,
              status: 0,
            }
          });
        }
      //CSS hi???n th??? button
      statusButton(3);
      // ch???y d??ng n??y oke th?? ngon  
    }

    //resetWheel
    function resetWheel() {
      //CSS hi???n th??? button
      statusButton(1);

      theWheel.stopAnimation(false);  // Stop the animation, false as param so does not call callback function.
      theWheel.rotationAngle = 0;     // Re-set the wheel angle to 0 degrees.
      theWheel.draw();                // Call draw to render changes to the wheel.

      wheelSpinning = false;          // Reset to false to power buttons and spin can be clicked again.
    }
    document.getElementById("spin_start").addEventListener("click", startSpin);
    document.getElementById("spin_reset").addEventListener("click", resetWheel);
  }
  moveToAccount() {
    return this._router.navigate(['/account']);
  }
  moveToHome() {

    return this._router.navigate(['/']);
  }

  moveToProfile() {
    return this._router.navigate(['/profile']);
  }
  moveToCart() {
    return this._router.navigate(['/cartBook']);
  }
  logout() {
    this.authService.logout();    
		$('#tongtien').html("&nbsp;" + this.formatCurrency("0"));
		$('.cart_items').html("0");
		localStorage.setItem("TongTien", "0");
    localStorage.setItem("TongCount", "0");
    // alert("alo")
    this._router.navigate(['/homePage']);
  }
  getPointByUserID() {
    //get point user by userID

    this._pointService.getPointByUserID(this.accountSocial._id).subscribe(
      Point => {
        localStorage.setItem("Point", Object.values(Point)[0].point);
        this.point.point = Object.values(Point)[0].point;
      },
      error => console.log(error)
    );
  }
  ChangeWheelSpnner(event: any) {
    this.changespinner = event.target.value;
    this.ngOnInit();
  }

  //search
  InputSearch = "";
  
  getInputSearch(event) {
    this.InputSearch = event.target.value;
    console.log(this.InputSearch)
  }
  Search() {
    var format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (this.InputSearch != "" && !format.test(this.InputSearch)) {
      return this._router.navigate(['/aboutUs/' + `/${this.InputSearch}`]);
    } else
      if (format.test(this.InputSearch)) {
        swal.fire({
          text: "Kh??ng ???????c ch???a k?? t??? ?????c bi???t!",
          icon: 'warning',
          showCancelButton: true,  
      confirmButtonText: 'Ok',  
      
        })
      }
  }

  goToCategory(id) {
    return this._router.navigate(['/rountlv2/category/' + `/${id}`])
  }
  goToAuthor(id) {
    return this._router.navigate(['/rountlv2/author/' + `/${id}`])
  }
  goToSale() {
    return this._router.navigate(['/rountlv2/sale/listSale'])
  }
}
