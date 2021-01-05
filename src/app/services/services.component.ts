// import { CookieService } from "angular2-cookie/core";
import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { DialogModalComponent } from "../dialog-modal/dialog-modal.component";
import { DeleteDialogComponent } from "../delete-dialog/delete-dialog.component";
import { PropertyServiceService } from "../property-service.service";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { SuccessComponent } from '../success/success.component';

@Component({
  selector: "app-services",
  templateUrl: "./services.component.html",
  styleUrls: ["./services.component.css"],
})
export class ServicesComponent implements OnInit {
  //Pagination
  data: Array<any>;
  totalRecords: Number;
  totalUserRecords: Number;
  page: Number = 1;
  itemPerPage = 50;
  //Search
  alphaSort:boolean=false;
  showNoRecord:boolean = false;
  searchText: any;
  orderByd: string = 'schoolName';
  reverse: boolean = false;
  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    public alertDialog: MatDialog,
    private property: PropertyServiceService,
    private router: Router,
    private cookieService: CookieService
  ) {
    //Pagination
    this.data = new Array<any>();

    dialog.afterAllClosed.subscribe(() => {
      this.ngOnInit();
      // if (this.userInfo.schoolid === 0) {
      // this.isSuperAdmin = true;
      //   this.getAllAdmin();
      // } else {
      //   this.getAdmin();
      // }
    });
  }
  totalResult: any;
  totalPages:any;
  isSuperAdmin: boolean = false;
  userInfo = JSON.parse(localStorage.getItem("UserInfo"));
  adminList: any = [];
  dataList: any;
  adminSchool:any = [];
  orderAdminFlag: boolean = false;
  searchWord:any;
  visibleClear:boolean = false;
  url = this.property.uri;
  getCookies: string = this.cookieService.get("LoginStatus");
  ngOnInit() {
    if (this.getCookies !== "login") {
      localStorage.removeItem("userInfo");
      // this.router.navigateByUrl("/login");
      window.location.href = "https://bullyingbuddyapp.com/admin/#/login";
    }
    if (this.userInfo === null || this.userInfo === undefined) {
      alert("You Have been LogOut, Kindly LogIn to Continue!");
      // this.router.navigateByUrl("/login");
      window.location.href = "https://bullyingbuddyapp.com/admin/#/login";
    }
    if (this.userInfo.schoolid === 0) {
      this.isSuperAdmin = true;
      this.getAllAdmin();
    } else {
      this.getAdmin();
    }
  }
  pageChanged(event) {
    // this.page = event;
    console.log("pagination", event);
     if(event!==""){
        this.page = event;
      if(event > this.totalPages){
        this.page = 1
      }
    if(this.searchText === ""||this.searchText === undefined){
    this.getAllAdmin();
    }
  }
  }
  showClear(eve){
    if(eve !==""){
        this.visibleClear = true;
    }
    else{
      this.visibleClear = false;
      this.getAllAdmin();
    }

  }

clearResult(){
  // alert("HIT");
  this.visibleClear = false;
  this.searchText="";
  this.searchWord="";
  this.getAllAdmin();
}
  getAllAdmin() {
    let arrLen: any = [];
    let page = this.page.toString();
    let pageNo: number = +page;
    pageNo = pageNo - 1;
    console.log("Page", pageNo);
    this.http.get(this.url + "bully-buddy/admin/list"+ "?pageno=" + pageNo,).subscribe((res: any) => {
      if (res.status == "200") {
        // console.log("RESSSSS", res);
        arrLen.push(res.result);
        // console.log("RESsss", arrLen[0].length);
        if (arrLen[0].length === 1) {
          this.adminList = [];
          this.adminList.push(res.result.content);
          this.data = res.result;
          this.totalRecords = res.result.totalElements;
          this.totalResult = res.result.totalelements;
          this.itemPerPage = res.result.pageable.pageSize;
          this.totalPages = res.result.totalPages;
        } else {
          this.adminList = res.result.content;
          this.data = res.result.content;
          this.totalRecords = res.result.totalElements;
          this.totalResult = res.result.totalElements;
          this.itemPerPage = res.result.pageable.pageSize;
          this.totalPages = res.result.totalPages;
        }
      }
    });
  }

  getAdmin() {
    let formObj = {
      id: this.userInfo.id,
    };
    let arrLen: any = [];
    this.http
      .post(this.url + "bully-buddy/admin/get_admin_by_id", formObj)
      .subscribe((res: any) => {
        if (res.status == "200") {
          // arrLen = [];
          arrLen.push(res.result);
          // console.log("RESsss", arrLen);
          if (arrLen.length === 1) {
            this.adminList = [];
            this.adminList.push(res.result);
            this.data = res.result;
            this.totalPages=arrLen.length;
            this.totalRecords = arrLen.length;
          } else {
            this.adminList = res.result;
            this.data = res.result;
            this.totalRecords = res.result.length;
          }
        }
        console.log("ADMINLENGTH", this.totalRecords);
      });
  }
  addAdmin() {
    this.dialog.open(DialogModalComponent, {
      width: "50%",
      data: { title: "Add Admin", divType: "addAdmin" },
    });
  }
  editAdmin(list) {
    this.dialog.open(DialogModalComponent, {
      width: "50%",
      data: {
        title: "Edit Admin",
        divType: "editAdmin",
        admin_id: list.id,
        admin_school_id: list.schoolid,
        // admin_school_dist: list.schooldist,
        admin_username: list.username,
        admin_password: list.password,
        // createdDate:list.
      },
    });
  }
  search(eve){
    return new Promise((resolve, reject) => {
     console.log("eve",eve)
      let search = eve;
     
      if(search === undefined || search === null|| search === ""){
        search = "null"
      }
      else{
        search = eve
      }
     
      if(search==="null"){
        this.getAllAdmin();
      }
      else{
      this.http
        .post(
          this.url + "bully-buddy/admin/search_admin"+ "?searchword=" + search + "&schoolId=" +this.userInfo.schoolid,"")
        .subscribe((res: any) => {
          if (res.status == "200") {
            this.adminList  = res.result;
            this.data = res.result;
            this.totalUserRecords = res.result.length
            
            console.log("Report",res.result);
           } 
           if(this.totalUserRecords>0){

            this.showNoRecord=false;
          }
          if(this.totalUserRecords<=0){
            this.showNoRecord=true;
          }
          //  else {
          //   alert(res.message + " : " + res.result);
          // }
          resolve();
        });
      }
    });
  }

  deleteAdmin(id) {
    var confirmResult = this.dialog.open(DeleteDialogComponent, {
      width: "20%",
      data: {
        title: "Delete Admin",
        message: "Are you want to delete this Admin!",
      },
    });
    confirmResult.afterClosed().subscribe((result: boolean) => {
      if (result) {
        let formObj = {
          id: id,
        };
        this.http
          .post(this.url + "bully-buddy/admin/delete_admin", formObj)
          .subscribe((res: any) => {
            if (res.status == "200") {
               this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "Admin Deleted", type: true },
          });
              if (this.userInfo.schoolid === 0) {
                // this.isSuperAdmin = true;
                this.getAllAdmin();
              } else {
                this.getAdmin();
              }
            }
            else{
               this.alertDialog.open(SuccessComponent, {
            width: "30%",
            data: { value: "Admin Deleted Failed", type: false },
          });
            }
          });
      }
    });
  }
  orderAdmin() {
    if (!this.orderAdminFlag) {
      this.adminList.sort((a, b) => {
        return b.id - a.id;
      });
    } else {
      this.adminList.sort((a, b) => {
        return a.id - b.id;
      });
    }
    this.orderAdminFlag = !this.orderAdminFlag;
  }
  setOrder(value: string) {
    if (this.orderByd === value) {
      this.reverse = !this.reverse;
    }
this.alphaSort=!this.alphaSort;
    this.orderByd = value;
  }
}
