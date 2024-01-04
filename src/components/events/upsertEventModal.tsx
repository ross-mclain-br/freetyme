import { Fragment, type SetStateAction, type Dispatch, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

import { api, type RouterOutputs } from "~/utils/api";
import { useUser } from "@clerk/nextjs";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "~/components/ui/textarea";
import { ColorPicker } from "~/components/ui/color-picker";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { Button } from "~/components/ui/button";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  duration: z.object({
    from: z.date(),
    to: z.date(),
  }),
  color: z.string().min(2, {
    message: "Please select a color for your event",
  }),
  textColor: z.string().min(2, {
    message: "Please select a text color for your event",
  }),
});
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

  const { RangePicker } = DatePicker;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: existingEvent?.title ?? "",
      description: existingEvent?.description ?? "",
      ...(existingEvent?.start &&
        existingEvent?.end && {
          duration: {
            from: existingEvent?.start,
            to: existingEvent?.end,
          },
        }),
      color: existingEvent?.color ?? "#2f056b",
      textColor: existingEvent?.textColor ?? "#f9e1cf",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(`SAVE EVENT`, data);
    if (
      data.title &&
      data.color &&
      data.textColor &&
      data?.duration?.from &&
      data?.duration?.to &&
      eventType?.id
    ) {
      void userEventMutation({
        id: existingEvent?.id ?? null,
        title: data?.title,
        description: data?.description ?? "",
        color: data?.color,
        textColor: data?.textColor,
        start: data.duration.from,
        image: "",
        location: "",
        ownerId: userData?.id ?? 0,
        typeId: eventType?.id,
        end: data.duration.to,
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
          toast({
            title: "Error saving event",
            description: (
              <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                <code className="text-white">{JSON.stringify(e, null, 2)}</code>
              </pre>
            ),
          });
        });
    } else {
      toast({
        title: "Please fill out all required fields",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });
    }

    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  };

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
                <Form {...form}>
                  <form
                    onSubmit={(event) => {
                      console.log(`SUBMIT`);
                      event.preventDefault();
                      console.log(`HANDLE SUBMIT`);
                      void form.handleSubmit(onSubmit, (e) => {
                        console.log(`ERROR`, e);
                      })(event);
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

                              <div className="mt-6 grid max-w-2xl grid-cols-1 gap-x-6 gap-y-2 px-3 sm:grid-cols-6 md:col-span-2">
                                <div className="sm:col-span-3">
                                  <FormField
                                    name="duration"
                                    control={form.control}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel
                                          className={
                                            "mb-2 block text-sm font-medium capitalize text-secondary"
                                          }
                                        >
                                          Select Event Duration
                                        </FormLabel>
                                        <RangePicker
                                          showTime
                                          use12Hours
                                          format={"YYYY-MM-DD hh:mm A"}
                                          className="mb-1"
                                          value={[
                                            field.value?.from
                                              ? dayjs(
                                                  new Date(field.value?.from)
                                                )
                                              : null,
                                            field.value?.to
                                              ? dayjs(new Date(field.value?.to))
                                              : null,
                                          ]}
                                          onChange={(value) => {
                                            if (value?.[0] && value?.[1]) {
                                              field.onChange({
                                                from: value?.[0]?.toDate(),
                                                to: value?.[1]?.toDate(),
                                              });
                                            }
                                          }}
                                        />
                                        <FormDescription></FormDescription>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                                <div className="sm:col-span-4">
                                  <FormField
                                    name="title"
                                    control={form.control}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel
                                          className={
                                            "mb-2 block text-sm font-medium capitalize text-secondary"
                                          }
                                        >
                                          {field.name}
                                        </FormLabel>
                                        <FormControl>
                                          <Input
                                            {...field}
                                            placeholder="Add title for your event"
                                            className="mb-1 block w-full rounded-md bg-secondary p-1.5 font-bold text-primary shadow-sm ring-1 ring-inset ring-secondary placeholder:font-bold placeholder:text-primary hover:border-secondary focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                                          />
                                        </FormControl>
                                        <FormDescription></FormDescription>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                                <div className="divide-b col-span-full">
                                  <FormField
                                    name="description"
                                    control={form.control}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel
                                          className={
                                            "mb-2 block text-sm font-medium capitalize text-secondary"
                                          }
                                        >
                                          {field.name}
                                        </FormLabel>
                                        <FormControl>
                                          <Textarea
                                            {...field}
                                            autoComplete="description"
                                            placeholder="Add description for your event"
                                            className="mb-1 block w-full rounded-md bg-secondary p-1.5 font-bold text-primary shadow-sm ring-1 ring-inset ring-secondary placeholder:font-bold placeholder:text-primary hover:border-secondary focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                                          />
                                        </FormControl>
                                        <FormDescription></FormDescription>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                                <div className="divide-b col-span-full flex items-center space-x-3">
                                  <div className="flex items-center">
                                    <FormField
                                      name="color"
                                      control={form.control}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel
                                            className={
                                              "block whitespace-nowrap text-sm font-medium leading-6 text-secondary"
                                            }
                                          >
                                            Background Color
                                          </FormLabel>
                                          <FormControl>
                                            <ColorPicker
                                              background={field.value}
                                              setBackground={(color) => {
                                                field.onChange(color);
                                              }}
                                            />
                                          </FormControl>
                                          <FormDescription></FormDescription>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                  <div className="flex items-center">
                                    <FormField
                                      name="textColor"
                                      control={form.control}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel
                                            className={
                                              "block whitespace-nowrap text-sm font-medium leading-6 text-secondary"
                                            }
                                          >
                                            Text Color
                                          </FormLabel>
                                          <FormControl>
                                            <ColorPicker
                                              background={field.value}
                                              setBackground={(color) => {
                                                field.onChange(color);
                                              }}
                                            />
                                          </FormControl>
                                          <FormDescription></FormDescription>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 flex items-center sm:mt-6">
                      <div className="flex flex-grow items-center justify-between gap-x-4">
                        <Button
                          type="button"
                          className="inline-flex w-24 justify-center rounded-md border border-secondary px-3 py-2 text-sm font-semibold text-secondary shadow-sm transition-all duration-300 hover:bg-secondary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tertiary"
                          onClick={() => setOpen(false)}
                        >
                          Back
                        </Button>
                        {existingEvent?.id && (
                          <Button
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
                          </Button>
                        )}
                        <Button
                          type="submit"
                          className="inline-flex w-24 justify-center rounded-md border border-secondary bg-secondary px-3 py-2 text-sm font-semibold text-tertiary shadow-sm transition-all duration-300 hover:bg-transparent hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tertiary"
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  </form>
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
