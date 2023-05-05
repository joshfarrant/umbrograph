import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
} from '@redwoodjs/forms';

import type { EditFileById, UpdateFileInput } from 'types/graphql';
import type { RWGqlError } from '@redwoodjs/forms';

type FormFile = NonNullable<EditFileById['file']>;

interface FileFormProps {
  file?: EditFileById['file'];
  onSave: (data: UpdateFileInput, id?: FormFile['id']) => void;
  error: RWGqlError;
  loading: boolean;
}

const FileForm = (props: FileFormProps) => {
  const onSubmit = (data: FormFile) => {
    props.onSave(data, props?.file?.id);
  };

  return (
    <div className="rw-form-wrapper">
      <Form<FormFile> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="owner"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Owner
        </Label>

        <TextField
          name="owner"
          defaultValue={props.file?.owner}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="owner" className="rw-field-error" />

        <Label
          name="data"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Data
        </Label>

        <TextField
          name="data"
          defaultValue={props.file?.data}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="data" className="rw-field-error" />

        <Label
          name="type"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Type
        </Label>

        <TextField
          name="type"
          defaultValue={props.file?.type}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="type" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  );
};

export default FileForm;
