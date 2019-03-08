import {
  Component,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
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
   * Nested form builder model.
   */
  profileForm = this.formBuilder.group({
    firstName: [''],
    lastName: [''],
    address: this.formBuilder.group({
      street: [''],
      city: [''],
      state: [''],
      zip: ['']
    }),
  });

  /**
   * Iterable list of form controls (for debug).
   */
  controlsList: NamedAbstractControl[];

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
  }

  /**
   * [debug] Create list of controls in given group.
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
   * [debug] Remove form control properties with circular references.
   * Enable binding form control piped to json for debug display.
   * @param controls Form control augmented with a very private key containing the control's name.
   * @returns Copy of form control with circular references removed.
   */
  formControlToJSON(controls: NamedAbstractControl) {

    const ctrl = Object.assign({}, controls);

    if (ctrl.hasOwnProperty('controls')) {
      /**
       * [todo] can't handle nested form group recursion to controls yet
       */
      return 'logging nested controls not yet supported';
    }

    const noCircularRefs = Object.assign({}, ctrl);

    /**
     * Properties in this list contain nasty, circular references.
     * `_parent` references the form group which has a reference to this control.
     * `valueChanges` only a problem when wrapping mat-input in mat-form-field (???).
     */
    const circularRefs = [
      '_parent',
      'valueChanges',
    ];

    for (const prop in ctrl) {
      if (ctrl.hasOwnProperty(prop)) {
        if (circularRefs.indexOf(prop) > -1) {
          noCircularRefs[prop] = 'OMITTED_CIRCULAR_REFERENCE';
        }
      }
    }

    return noCircularRefs;
  }

}
