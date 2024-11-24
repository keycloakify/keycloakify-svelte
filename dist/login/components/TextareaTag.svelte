<script lang="ts">
  import { assert } from 'keycloakify/tools/assert';
  import type { InputFieldByTypeProps } from './InputFieldByTypeProps';

  const { attribute, dispatchFormAction, kcClsx, displayableErrors, valueOrValues }: InputFieldByTypeProps = $props();

  assert(typeof valueOrValues === 'string');

  const value = valueOrValues;
</script>

<textarea
  id={attribute.name}
  name={attribute.name}
  class={kcClsx('kcInputClass')}
  aria-invalid={displayableErrors.length !== 0}
  disabled={attribute.readOnly}
  cols={attribute.annotations.inputTypeCols === undefined
    ? undefined
    : parseInt(`${attribute.annotations.inputTypeCols}`)}
  rows={attribute.annotations.inputTypeRows === undefined
    ? undefined
    : parseInt(`${attribute.annotations.inputTypeRows}`)}
  maxlength={attribute.annotations.inputTypeMaxlength === undefined
    ? undefined
    : parseInt(`${attribute.annotations.inputTypeMaxlength}`)}
  {value}
  onchange={(event) =>
    dispatchFormAction('formAction', {
      action: 'update',
      name: attribute.name,
      valueOrValues: event.currentTarget.value,
    })}
  onblur={() =>
    dispatchFormAction('formAction', {
      action: 'focus lost',
      name: attribute.name,
      fieldIndex: undefined,
    })}
></textarea>
