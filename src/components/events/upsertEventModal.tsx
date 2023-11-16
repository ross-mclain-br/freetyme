import { Fragment, type SetStateAction, type Dispatch, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  ColorPicker,
  DatePicker,
  Form,
  Input,
  message,
  Select,
  Upload,
} from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import type {
  RcFile,
  UploadChangeParam,
  UploadFile,
  UploadProps,
} from "antd/es/upload/interface";
import Image from "next/image";
import { api } from "~/utils/api";

const { TextArea } = Input;

export const UpsertEventModal = ({
  open,
  setOpen,
  selectedDay,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  selectedDay: Date;
}) => {
  const { RangePicker } = DatePicker;

  const { mutateAsync: userEventMutation } =
    api.event.upsertEvent.useMutation();

  const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };

  const beforeUpload = async (file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      await message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      await message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>();

  const handleChange: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile<RcFile>>
  ) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj!, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-tertiary/50 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6">
                <Form>
                  <div>
                    <div className="mx-auto max-w-md sm:max-w-3xl">
                      <div className="text-secondary">
                        <div className="space-y-12">
                          <div className=" gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12">
                            <div className="text-leftr">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className=" h-12 w-12 text-secondary"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                                />
                              </svg>

                              <h2 className="mt-2 text-base font-semibold leading-6 text-secondary">
                                Add Event
                              </h2>
                            </div>

                            <div className="mt-6 grid max-w-2xl grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6 md:col-span-2">
                              <div className="sm:col-span-3">
                                <Form.Item
                                  name="duration"
                                  rules={[
                                    {
                                      required: true,
                                      message:
                                        "Please input a duration of your event",
                                    },
                                  ]}
                                >
                                  <label
                                    htmlFor="duration"
                                    className="mb-2 block text-sm font-medium leading-6 text-secondary"
                                  >
                                    Select Event Duration
                                  </label>
                                  <RangePicker
                                    showTime
                                    use12Hours
                                    format={"YYYY-MM-DD hh:mm A"}
                                    className="mb-1"
                                  />
                                </Form.Item>
                              </div>
                              <div className="sm:col-span-4">
                                <Form.Item
                                  name="title"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Please input a title",
                                    },
                                  ]}
                                >
                                  <label
                                    htmlFor="title"
                                    className="mb-2 block text-sm font-medium leading-6 text-secondary"
                                  >
                                    Title
                                  </label>
                                  <Input
                                    type="title"
                                    autoComplete="title"
                                    placeholder="Add title for your event"
                                    className="mb-1 block w-full rounded-md bg-secondary p-1.5 font-bold text-primary shadow-sm ring-1 ring-inset ring-secondary placeholder:font-bold placeholder:text-primary hover:border-secondary focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                                  />
                                </Form.Item>
                              </div>
                              <div className="divide-b col-span-full">
                                <Form.Item name="description">
                                  <label
                                    htmlFor="description"
                                    className="block text-sm font-medium leading-6 text-secondary"
                                  >
                                    Description
                                  </label>
                                  <div className="mt-2">
                                    <TextArea
                                      autoComplete="description"
                                      placeholder="Add description for your event"
                                      className="mb-1 block w-full rounded-md bg-secondary p-1.5 font-bold text-primary shadow-sm ring-1 ring-inset ring-secondary placeholder:font-bold placeholder:text-primary hover:border-secondary focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                                    />
                                  </div>
                                </Form.Item>
                              </div>
                              {/* <div className="divide-b col-span-full hidden">
                                <label
                                  htmlFor="type"
                                  className="block text-sm font-medium leading-6"
                                >
                                  Type
                                </label>
                                <div className="mt-2">
                                  <Select
                                    labelInValue
                                    style={{ width: 200 }}
                                    placeholder="Search to Select"
                                    optionFilterProp="children"
                                    defaultValue={{ value: "Calendar" }}
                                    filterOption={(input, option) =>
                                      (option?.label ?? "").includes(input)
                                    }
                                    filterSort={(optionA, optionB) =>
                                      (optionA?.label ?? "")
                                        .toLowerCase()
                                        .localeCompare(
                                          (optionB?.label ?? "").toLowerCase()
                                        )
                                    }
                                    options={eventTypesData?.map((type) => ({
                                      value: type.id,
                                      label: type.name,
                                    }))}
                                  />
                                </div>
                              </div> */}
                              <div className="divide-b col-span-full flex items-center space-x-3">
                                <Form.Item name="color">
                                  <div className="flex items-center">
                                    <ColorPicker
                                      size="small"
                                      defaultValue={"#2f056b"}
                                      className={"!border !border-tertiary"}
                                    />
                                    <label
                                      htmlFor="region"
                                      className="ml-2 block whitespace-nowrap text-sm font-medium leading-6 text-secondary"
                                    >
                                      Color Picker
                                    </label>
                                  </div>
                                </Form.Item>
                                <Form.Item name="textColor">
                                  <div className="flex items-center">
                                    <ColorPicker
                                      size="small"
                                      defaultValue={"#f9e1cf"}
                                      className={"!border !border-tertiary"}
                                    />
                                    <label
                                      htmlFor="region"
                                      className="ml-2 block whitespace-nowrap text-sm font-medium leading-6 text-secondary"
                                    >
                                      Text Color Picker
                                    </label>
                                  </div>
                                </Form.Item>
                              </div>
                              {/*<div className="sm:col-span-full">*/}
                              {/*  <label*/}
                              {/*    htmlFor="location"*/}
                              {/*    className="block text-sm font-medium leading-6"*/}
                              {/*  >*/}
                              {/*    Location*/}
                              {/*  </label>*/}
                              {/*  <div className="mt-2">*/}
                              {/*    <Input*/}
                              {/*      type="search"*/}
                              {/*      name="location"*/}
                              {/*      id="location"*/}
                              {/*      autoComplete="location"*/}
                              {/*      placeholder="Add location for your event"*/}
                              {/*      className="block w-full rounded-md  p-1.5 font-bold text-primary shadow-sm ring-1 ring-inset ring-secondary placeholder:font-bold placeholder:text-primary hover:border-secondary focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"*/}
                              {/*    />*/}
                              {/*  </div>*/}
                              {/*</div>*/}
                              {/*<div className="sm:col-span-full">*/}
                              {/*  <label*/}
                              {/*    htmlFor="image"*/}
                              {/*    className="block text-sm font-medium leading-6"*/}
                              {/*  >*/}
                              {/*    Image*/}
                              {/*  </label>*/}
                              {/*  <div className="mt-2">*/}
                              {/*    <Upload*/}
                              {/*      name="avatar"*/}
                              {/*      listType="picture-card"*/}
                              {/*      className="avatar-uploader"*/}
                              {/*      showUploadList={false}*/}
                              {/*      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"*/}
                              {/*      beforeUpload={beforeUpload}*/}
                              {/*      onChange={handleChange}*/}
                              {/*    >*/}
                              {/*      {imageUrl ? (*/}
                              {/*        <Image*/}
                              {/*          src={imageUrl}*/}
                              {/*          width={120}*/}
                              {/*          height={120}*/}
                              {/*          alt="avatar"*/}
                              {/*          style={{ width: "100%" }}*/}
                              {/*        />*/}
                              {/*      ) : (*/}
                              {/*        uploadButton*/}
                              {/*      )}*/}
                              {/*    </Upload>*/}
                              {/*  </div>*/}
                              {/*</div>*/}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 flex items-center justify-center sm:mt-6">
                    <div className="space-x-4">
                      <button
                        type="button"
                        className="inline-flex w-24 justify-center rounded-md border border-secondary px-3 py-2 text-sm font-semibold text-secondary shadow-sm transition-all duration-300 hover:bg-secondary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tertiary"
                        onClick={() => setOpen(false)}
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="inline-flex w-24 justify-center rounded-md border border-secondary bg-secondary px-3 py-2 text-sm font-semibold text-tertiary shadow-sm transition-all duration-300 hover:bg-transparent hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tertiary"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </Form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
export default UpsertEventModal;
