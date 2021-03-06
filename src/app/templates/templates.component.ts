import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "app-templates",
  templateUrl: "./templates.component.html",
  styleUrls: ["./templates.component.css"],
})
export class TemplatesComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) {}

  userInfo = JSON.parse(localStorage.getItem("UserInfo"));

  getCookies: string = this.cookieService.get("LoginStatus");

  ngOnInit() {
    if (this.getCookies !== "login") {
      localStorage.removeItem("userInfo");
      this.router.navigateByUrl("/login");
    }
    if (this.userInfo === null || this.userInfo === undefined) {
      alert("You Have been LogOut, Kindly LogIn to Continue!");
      this.router.navigateByUrl("/login");
    }
  }

  userExcelDownload() {
    let url = "http://3.128.136.18/admin/templates/user_upload.xlsx";
    window.location.href = url;
    // window.open(url, "_blank");
    // this.router.navigateByUrl(
    //   "http://3.128.136.18/admin/templates/user_upload.xlsx"
    // );
    // this.http.get(url, { responseType: "blob" }).subscribe((data) => {
    //   console.log("BLOB", data);
    //   const blob = new Blob([data], {
    //     type: "application/vnd.ms.excel",
    //   });
    //   const file = new File([blob], "user_template" + ".xlsx", {
    //     type: "application/vnd.ms.excel",
    //   });
    //   saveAs(file);
    // });
  }
  teacherExcelDownload() {
    let url = "http://3.128.136.18/admin/templates/teacher_upload.xlsx";
    window.location.href = url;
    // window.open(url, "_blank");
    // this.http.get(url, { responseType: "blob" }).subscribe((data) => {
    //   console.log("BLOB", data);
    //   const blob = new Blob([data], {
    //     type: "application/vnd.ms.excel",
    //   });
    //   const file = new File([blob], "teacher_template" + ".xlsx", {
    //     type: "application/vnd.ms.excel",
    //   });
    //   saveAs(file);
    // });
  }
  busRouteExcelDownload() {
    let url = "http://3.128.136.18/admin/templates/busroute_upload.xlsx";
    // window.open(url, "_blank");
    window.location.href = url;
    // this.http.get(url, { responseType: "blob" }).subscribe((data) => {
    //   console.log("BLOB", data);
    //   const blob = new Blob([data], {
    //     type: "application/vnd.ms.excel",
    //   });
    //   const file = new File([blob], "busroute_template" + ".xlsx", {
    //     type: "application/vnd.ms.excel",
    //   });
    //   saveAs(file);
    // });
  }
}
