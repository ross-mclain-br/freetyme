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
import { api, RouterOutputs } from "~/utils/api";
import { Color } from "antd/es/color-picker";
import { useUser } from "@clerk/nextjs";
import dayjs from "dayjs";
import { format } from "date-fns";

const { TextArea } = Input;

export const UpsertEventModal = ({
  open,
  setOpen,
  selectedDay,
  existingEvent,
  setExistingEvent,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  selectedDay?: Date;
  existingEvent?: RouterOutputs["event"]["getEventsByUserId"][0]["event"];
  setExistingEvent?: Dispatch<
    SetStateAction<
      RouterOutputs["event"]["getEventsByUserId"][0]["event"] | undefined
    >
  >;
}) => {
  const { RangePicker } = DatePicker;

  const [form] = Form.useForm();
  const { user } = useUser();

  const { data: userData } = api.user.getUserByExternalId.useQuery(
    {
      externalUserId: user?.id ?? "",
    },
    {
      enabled: !!user?.id,
    }
  );

  const { data: eventTypesData } = api.eventType.getEventTypes.useQuery();

  const { data: eventData, refetch: eventDataRefetch } =
    api.event.getEventsByUserId.useQuery(
      {
        userId: userData?.id ?? 0,
      },
      {
        enabled: !!userData?.id,
      }
    );

  const eventType = eventTypesData?.find((type) =>
    existingEvent?.typeId
      ? type.id === existingEvent?.typeId
      : type?.code?.toLowerCase() === "calendar"
  );

  const { mutateAsync: userEventMutation } =
    api.event.upsertEvent.useMutation();

  const { mutateAsync: userEventDeleteMutation } =
    api.event.deleteEvent.useMutation();

  const [title, setTitle] = useState<string>(existingEvent?.title ?? "");
  const [description, setDescription] = useState<string>(
    existingEvent?.description ?? ""
  );
  const [color, setColor] = useState<string>(existingEvent?.color ?? "#2f056b");
  const [textColor, setTextColor] = useState<string>(
    existingEvent?.textColor ?? "#f9e1cf"
  );
  const [duration, setDuration] = useState<
    { start: Date; end: Date } | undefined
  >(
    existingEvent?.start && existingEvent?.end
      ? {
          start: existingEvent?.start,
          end: existingEvent?.end,
        }
      : undefined
  );

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
                <Form
                  form={form}
                  name="upsertEventForm"
                  layout="vertical"
                  initialValues={{
                    title: existingEvent?.title ?? "",
                    description: existingEvent?.description ?? "",
                    ...(existingEvent?.start &&
                      existingEvent?.end && {
                        duration: [
                          dayjs(
                            format(existingEvent?.start, "yyyy-MM-dd hh:mm a"),
                            "YYYY-MM-DD hh:mm A"
                          ),
                          dayjs(
                            format(existingEvent?.end, "yyyy-MM-dd hh:mm a"),
                            "YYYY-MM-DD hh:mm A"
                          ),
                        ],
                      }),
                    color: existingEvent?.color ?? "#2f056b",
                    textColor: existingEvent?.textColor ?? "#f9e1cf",
                  }}
                  onFinish={(values) => {
                    if (
                      title &&
                      color &&
                      textColor &&
                      duration?.start &&
                      duration?.end &&
                      eventType?.id
                    ) {
                      void userEventMutation({
                        id: existingEvent?.id ?? null,
                        title: title,
                        description: description ?? "",
                        color: color,
                        textColor: textColor,
                        start: duration?.start,
                        image: "",
                        location: "",
                        ownerId: userData?.id ?? 0,
                        typeId: eventType?.id,
                        end: duration?.end,
                      })
                        .then(() => {
                          void eventDataRefetch();
                          setOpen(false);
                          if (setExistingEvent) {
                            setExistingEvent(undefined);
                          }
                        })
                        .catch((e) => {
                          console.error(e);
                        });
                    }
                  }}
                >
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

                            <div className="mt-6 grid max-w-2xl grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6 md:col-span-2">
                              <div className="sm:col-span-3">
                                <label
                                  htmlFor="duration"
                                  className="mb-2 block text-sm font-medium text-secondary"
                                >
                                  Select Event Duration
                                </label>
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
                                  <RangePicker
                                    showTime
                                    use12Hours
                                    format={"YYYY-MM-DD hh:mm A"}
                                    className="mb-1"
                                    onChange={(value) => {
                                      if (value?.[0] && value?.[1]) {
                                        setDuration({
                                          start: value?.[0]?.toDate(),
                                          end: value?.[1]?.toDate(),
                                        });
                                      }
                                    }}
                                  />
                                </Form.Item>
                              </div>
                              <div className="sm:col-span-4">
                                <label
                                  htmlFor="title"
                                  className="mb-2 block text-sm font-medium text-secondary"
                                >
                                  Title
                                </label>
                                <Form.Item
                                  name="title"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Please input a title",
                                    },
                                  ]}
                                >
                                  <Input
                                    placeholder="Add title for your event"
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="mb-1 block w-full rounded-md bg-secondary p-1.5 font-bold text-primary shadow-sm ring-1 ring-inset ring-secondary placeholder:font-bold placeholder:text-primary hover:border-secondary focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                                  />
                                </Form.Item>
                              </div>
                              <div className="divide-b col-span-full">
                                <label
                                  htmlFor="description"
                                  className="block text-sm font-medium leading-6 text-secondary"
                                >
                                  Description
                                </label>
                                <Form.Item
                                  name="description"
                                  className={"mt-2"}
                                >
                                  <TextArea
                                    autoComplete="description"
                                    placeholder="Add description for your event"
                                    onChange={(e) =>
                                      setDescription(e.target.value)
                                    }
                                    className="mb-1 block w-full rounded-md bg-secondary p-1.5 font-bold text-primary shadow-sm ring-1 ring-inset ring-secondary placeholder:font-bold placeholder:text-primary hover:border-secondary focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                                  />
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
                                <div className="flex items-center">
                                  <Form.Item
                                    name="color"
                                    className={"mb-0 flex items-center"}
                                  >
                                    <ColorPicker
                                      size="small"
                                      onChange={(color) => {
                                        setColor(color?.toHexString());
                                      }}
                                      className={"!border !border-tertiary"}
                                    />
                                  </Form.Item>
                                  <label
                                    htmlFor="region"
                                    className="ml-2 block whitespace-nowrap text-sm font-medium leading-6 text-secondary"
                                  >
                                    Color Picker
                                  </label>
                                </div>
                                <div className="flex items-center">
                                  <Form.Item
                                    name="textColor"
                                    className={"mb-0 flex items-center"}
                                  >
                                    <ColorPicker
                                      size="small"
                                      onChange={(color) => {
                                        setTextColor(color?.toHexString());
                                      }}
                                      className={"!border !border-tertiary"}
                                    />
                                  </Form.Item>
                                  <label
                                    htmlFor="region"
                                    className="ml-2 block whitespace-nowrap text-sm font-medium leading-6 text-secondary"
                                  >
                                    Text Color Picker
                                  </label>
                                </div>
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
                  <div className="mt-5 flex items-center sm:mt-6">
                    <div className="flex flex-grow items-center justify-between gap-x-4">
                      <button
                        type="button"
                        className="inline-flex w-24 justify-center rounded-md border border-secondary px-3 py-2 text-sm font-semibold text-secondary shadow-sm transition-all duration-300 hover:bg-secondary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tertiary"
                        onClick={() => setOpen(false)}
                      >
                        Back
                      </button>
                      {existingEvent?.id && (
                        <button
                          type="button"
                          className="ml-auto mr-4 inline-flex w-24 justify-center rounded-md border border-destructive bg-destructive px-3 py-2 text-sm font-semibold text-secondary shadow-sm transition-all duration-300 hover:bg-destructive/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tertiary"
                          onClick={() => {
                            userEventDeleteMutation({
                              id: existingEvent?.id,
                            })
                              .then(() => {
                                void eventDataRefetch();
                                setOpen(false);
                                if (setExistingEvent) {
                                  setExistingEvent(undefined);
                                }
                              })
                              .catch((e) => {
                                console.error(e);
                              });
                          }}
                        >
                          Delete
                        </button>
                      )}
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
