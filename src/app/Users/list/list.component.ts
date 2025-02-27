import { Component, OnInit } from '@angular/core';
import { UserService, UserData } from '../../services/user.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  constructor(
    private _userService: UserService
  ) { }

  ngOnInit() {
  }

}
