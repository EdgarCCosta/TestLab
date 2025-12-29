import { AbstractControl, ValidationErrors } from '@angular/forms';

export function atLeastOneStep(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return { noSteps: true };

  const steps = control.value
    .split(/[\n,\.]+/)
    .map((s: string) => s.trim())
    .filter((s: string) => s.length > 0);

  return steps.length > 0 ? null : { noSteps: true };
}