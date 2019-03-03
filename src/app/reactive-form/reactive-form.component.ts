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
 * Alias of form control base augmented with a very private key.
 */
type NamedAbstractControl = AbstractControl & {
  __super_private_debug_name_okay: string,
};

@Component({
  selector: 'app-reactive-form',
  templateUrl: './reactive-form.component.html',
  styleUrls: ['./reactive-form.component.scss']
})
export class ReactiveFormComponent implements OnInit {

  /**
   * Group controls input.
   */
  nameGroup = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
  });

  /**
   * Iterable list of form controls (for debug).
   */
  controlsList: NamedAbstractControl[];

  constructor() { }

  ngOnInit() {
  }

  /**
   * Create list of controls in given group.
   * Augments each control with private key containing the control's name.
   * Allows an isolated form control to be identified by name.
   * @param group Form group with controls to list.
   * @returns Iterable list of form controls for debug display.
   */
  controlsKeysToList(group: FormGroup) {

    const controls = Object.assign({}, group.controls);
    const controlsList: NamedAbstractControl[] = [];

    for (const ctrl in controls) {
      if (controls.hasOwnProperty(ctrl)) {

        const ctrlTaggedWithName: NamedAbstractControl = Object.assign({}, controls[ctrl], {
          __super_private_debug_name_okay: ctrl,
        });
        controlsList.push(ctrlTaggedWithName);
      }
    }
    return controlsList;
  }

  /**
   * Remove form control properties with circular references.
   * Enable binding form control piped to json for debug display.
   * @param ctrl Form control augmented with a very private key containing the control's name
   * @returns Copy of form control with circular references removed.
   */
  formControlToJSON(ctrl: NamedAbstractControl) {

    const noCircularRefs = Object.assign({}, ctrl);
    for (const prop in ctrl) {

      if (ctrl.hasOwnProperty(prop) && prop === '_parent') {
        delete noCircularRefs[prop];
      }
    }

    return noCircularRefs;
  }

}
