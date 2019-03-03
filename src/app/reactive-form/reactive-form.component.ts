import {
  Component,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  AbstractControl,
} from '@angular/forms';

/**
 * ok
 */
type NamedAbstractControl = AbstractControl & {
  __super_private_debug_name_okay: string,
}

@Component({
  selector: 'app-reactive-form',
  templateUrl: './reactive-form.component.html',
  styleUrls: ['./reactive-form.component.scss']
})
export class ReactiveFormComponent implements OnInit {

  /**
   * yo
   */
  nameGroup = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
  });

  /**
   * so
   */
  controlsList: NamedAbstractControl[];

  constructor() { }

  ngOnInit() {
  }

  /**
   * uh
   * @param group FormGroup with controls to list
   */
  controlsKeysToList(group: FormGroup): NamedAbstractControl[] {

    const controls = Object.assign({}, group.controls);
    const controlsList: NamedAbstractControl[] = [];

    for (const ctrl in controls) {
      if (controls.hasOwnProperty(ctrl)) {

        const ctrlTaggedWithName: NamedAbstractControl = Object.assign({}, controls[ctrl], {
          '__super_private_debug_name_okay': ctrl,
        });
        controlsList.push(ctrlTaggedWithName);
      }
    }
    return controlsList;
  }

  /**
   * duh
   * @param ctrl FormControl augmented with a very private key containing the control's name
   */
  formControlToJSON(ctrl: NamedAbstractControl) {

    let noCircularRefs = Object.assign({}, ctrl);
    for (const prop in ctrl) {

      if (prop === '_parent') {
        delete noCircularRefs[prop];
      }
    }

    return noCircularRefs;
  }

}
