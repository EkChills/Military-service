"use client"

import { useEffect } from "react"
import { useForm, Controller, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { nigerianStates } from "@/lib/constants"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

// Define the form schema with Zod
const formSchema = z.object({
  service: z.string().min(1, "Service is required"),
  rank: z.string().min(1, "Rank is required"),
  modeOfEntry: z.string().min(1, "Mode of entry is required"),
  serviceNumber: z.string().min(1, "Service number is required"),
  core: z.string().min(1, "Core is required"),
  yearsInService: z.string().min(1, "Years in service is required"),
  modeOfRetirement: z.string().default("voluntary"),
  maritalStatus: z.string().default("single"),
  numberOfChildren: z.string().default("0"),
  disability: z.string().default("no"),
  tribalMark: z.string().default("no"),
  bloodGroup: z.string().min(1, "Blood group is required"),
  genotype: z.string().min(1, "Genotype is required"),
  medicalStatus: z.string().optional(),
  skills: z.string().optional(),
  numberOfCourses: z.string().default("0"),
  courses: z.array(z.string()).optional(),
  appointments: z.array(z.string()).optional(),
  lastUnit: z.string().min(1, "Last unit is required"),
  stateOfLastUnit: z.string().min(1, "State of last unit is required"),
  nextOfKin: z.object({
    fullName: z.string().min(1, "Next of kin name is required"),
    relationship: z.string().min(1, "Relationship is required"),
    address: z.string().min(1, "Address is required"),
    phoneNumber: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^\d{11}$/, "Phone number must be 11 digits"),
    email: z.string().email("Invalid email format").optional().or(z.literal("")),
  }),
})

// Define the form data type
type FormData = z.infer<typeof formSchema>

export default function MilitaryServiceForm() {
  // Initialize React Hook Form
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      service: "",
      rank: "",
      modeOfEntry: "",
      serviceNumber: "",
      core: "",
      yearsInService: "",
      modeOfRetirement: "voluntary",
      maritalStatus: "single",
      numberOfChildren: "0",
      disability: "no",
      tribalMark: "no",
      bloodGroup: "",
      genotype: "",
      medicalStatus: "",
      skills: "",
      numberOfCourses: "0",
      courses: [],
      appointments: Array(10).fill(""),
      lastUnit: "",
      stateOfLastUnit: "",
      nextOfKin: {
        fullName: "",
        relationship: "",
        address: "",
        phoneNumber: "",
        email: "",
      },
    },
  })

  // Use field array for dynamic courses
  const { fields: courseFields, replace: replaceCourses } = useFieldArray<any>({
    control,
    name: "courses",
  })

  // Use field array for appointments
  const { fields: appointmentFields } = useFieldArray<any>({
    control,
    name: "appointments",
  })

  // Watch for changes in service and numberOfCourses
  const watchService = watch("service")
  const watchNumberOfCourses = watch("numberOfCourses")

  // Reset rank and mode of entry when service changes
  useEffect(() => {
    if (watchService) {
      setValue("rank", "")
      setValue("modeOfEntry", "")
    }
  }, [watchService, setValue])

  // Update courses array when numberOfCourses changes
  useEffect(() => {
    const numCourses = Number.parseInt(watchNumberOfCourses || "0")
    const currentCourses = watch("courses") || []
    const newCourses = Array(numCourses)
      .fill("")
      .map((_, i) => currentCourses[i] || "")
    replaceCourses(newCourses)
  }, [watchNumberOfCourses, replaceCourses, watch])

  // Custom validation for service number
  const validateServiceNumber = (value: string, service: string) => {
    if (!value) return false

    if (service === "army") {
      // Army format: e.g. 56NA/00/12345
      return /^\d+NA\/\d+\/\d+$/.test(value)
    } else if (service === "airforce") {
      // Air Force format: e.g. NAF47/12345
      return /^NAF\d+\/\d+$/.test(value)
    } else if (service === "navy") {
      // Navy format: e.g. S00087
      return /^[A-Z]\d+$/.test(value)
    }

    return false
  }

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    try {
      // Validate service number format
      if (!validateServiceNumber(data.serviceNumber, data.service)) {
        setValue("serviceNumber", "", { shouldValidate: true })
        return
      }

      // Log the form data to the console for API integration
      console.log("Form data ready for API submission:", data)

      // Here's where you would integrate with your API
      // Example API call:
      /*
      const response = await fetch('your-api-endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('API submission failed');
      }
      
      const responseData = await response.json();
      console.log('API response:', responseData);
      */

      // For now, just show a success message
      alert("Form submitted successfully! Check the console for the form data.")

      // Optionally reset the form after successful submission
      // reset();
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("An error occurred while submitting the form. Please try again.")
    }
  }

  const getServiceNumberPlaceholder = () => {
    if (watchService === "army") {
      return "e.g. 56NA/00/12345"
    } else if (watchService === "airforce") {
      return "e.g. NAF47/12345"
    } else if (watchService === "navy") {
      return "e.g. S00087"
    }
    return ""
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>Military Service Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Accordion type="single" collapsible defaultValue="section-1">
            <AccordionItem value="section-1">
              <AccordionTrigger className="text-lg font-semibold">Service Information</AccordionTrigger>
              <AccordionContent className="space-y-6 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="service" className="text-base font-medium">
                    Service *
                  </Label>
                  <Controller
                    name="service"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger id="service" aria-invalid={!!errors.service}>
                          <SelectValue placeholder="Select your service" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="army">Nigerian Army</SelectItem>
                          <SelectItem value="airforce">Nigerian Air Force</SelectItem>
                          <SelectItem value="navy">Nigerian Navy</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.service && <p className="text-sm text-red-500">{errors.service.message}</p>}
                </div>

                {watchService && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="rank" className="text-base font-medium">
                        Rank *
                      </Label>
                      <Controller
                        name="rank"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger id="rank" aria-invalid={!!errors.rank}>
                              <SelectValue placeholder="Select your rank" />
                            </SelectTrigger>
                            <SelectContent>
                              {watchService === "army" && (
                                <>
                                  <SelectItem value="army_warrant_officer">Army Warrant Officer</SelectItem>
                                  <SelectItem value="master_warrant_officer">Master Warrant Officer</SelectItem>
                                  <SelectItem value="warrant_officer">Warrant Officer</SelectItem>
                                  <SelectItem value="staff_sergeant">Staff Sergeant</SelectItem>
                                  <SelectItem value="sergeant">Sergeant</SelectItem>
                                  <SelectItem value="corporal">Corporal</SelectItem>
                                  <SelectItem value="lance_corporal">Lance Corporal</SelectItem>
                                  <SelectItem value="private">Private</SelectItem>
                                </>
                              )}
                              {watchService === "airforce" && (
                                <>
                                  <SelectItem value="airforce_warrant_officer">Air Force Warrant Officer</SelectItem>
                                  <SelectItem value="master_warrant_officer">Master Warrant Officer</SelectItem>
                                  <SelectItem value="warrant_officer">Warrant Officer</SelectItem>
                                  <SelectItem value="flight_sergeant">Flight Sergeant</SelectItem>
                                  <SelectItem value="sergeant">Sergeant</SelectItem>
                                  <SelectItem value="corporal">Corporal</SelectItem>
                                  <SelectItem value="lance_corporal">Lance Corporal</SelectItem>
                                  <SelectItem value="aircraft_person">Aircraft Woman / Aircraft Man</SelectItem>
                                </>
                              )}
                              {watchService === "navy" && (
                                <>
                                  <SelectItem value="navy_warrant_officer">Navy Warrant Officer</SelectItem>
                                  <SelectItem value="master_warrant_officer">Master Warrant Officer</SelectItem>
                                  <SelectItem value="warrant_officer">Warrant Officer</SelectItem>
                                  <SelectItem value="petty_officer">Petty Officer</SelectItem>
                                  <SelectItem value="leading_seaman">Leading Seaman</SelectItem>
                                  <SelectItem value="able_seaman">Able Seaman</SelectItem>
                                  <SelectItem value="seaman">Seaman</SelectItem>
                                  <SelectItem value="ordinary_seaman">Ordinary Seaman</SelectItem>
                                </>
                              )}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.rank && <p className="text-sm text-red-500">{errors.rank.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="modeOfEntry" className="text-base font-medium">
                        Mode of Entry *
                      </Label>
                      <Controller
                        name="modeOfEntry"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger id="modeOfEntry" aria-invalid={!!errors.modeOfEntry}>
                              <SelectValue placeholder="Select mode of entry" />
                            </SelectTrigger>
                            <SelectContent>
                              {watchService === "army" && (
                                <>
                                  <SelectItem value="ex_boy">Ex Boy</SelectItem>
                                  <SelectItem value="recruit">Recruit</SelectItem>
                                </>
                              )}
                              {watchService === "airforce" && (
                                <>
                                  <SelectItem value="ex_jam">Ex Jam</SelectItem>
                                  <SelectItem value="recruit">Recruit</SelectItem>
                                </>
                              )}
                              {watchService === "navy" && <SelectItem value="recruit">Recruit</SelectItem>}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.modeOfEntry && <p className="text-sm text-red-500">{errors.modeOfEntry.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="serviceNumber" className="text-base font-medium">
                        Service Number *
                      </Label>
                      <Input
                        id="serviceNumber"
                        placeholder={getServiceNumberPlaceholder()}
                        className="placeholder:text-gray-400 placeholder:text-sm"
                        aria-invalid={!!errors.serviceNumber}
                        {...register("serviceNumber")}
                      />
                      <p className="text-sm text-muted-foreground">
                        Please enter your service number in the correct format
                      </p>
                      {errors.serviceNumber && <p className="text-sm text-red-500">{errors.serviceNumber.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="core" className="text-base font-medium">
                        Core *
                      </Label>
                      <Input
                        id="core"
                        placeholder="Enter your core"
                        aria-invalid={!!errors.core}
                        {...register("core")}
                      />
                      {errors.core && <p className="text-sm text-red-500">{errors.core.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="yearsInService" className="text-base font-medium">
                        How many years in service *
                      </Label>
                      <Controller
                        name="yearsInService"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger id="yearsInService" aria-invalid={!!errors.yearsInService}>
                              <SelectValue placeholder="Select years in service" />
                            </SelectTrigger>
                            <SelectContent>
                              <ScrollArea className="h-72">
                                {Array.from({ length: 40 }, (_, i) => (
                                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                                    {i + 1}
                                  </SelectItem>
                                ))}
                              </ScrollArea>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.yearsInService && <p className="text-sm text-red-500">{errors.yearsInService.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base font-medium">Mode of Retirement *</Label>
                      <Controller
                        name="modeOfRetirement"
                        control={control}
                        render={({ field }) => (
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="voluntary" id="voluntary" />
                              <Label htmlFor="voluntary">Voluntary retirement</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="mandatory" id="mandatory" />
                              <Label htmlFor="mandatory">Mandatory retirement</Label>
                            </div>
                          </RadioGroup>
                        )}
                      />
                    </div>
                  </>
                )}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="section-2">
              <AccordionTrigger className="text-lg font-semibold">Personal Information</AccordionTrigger>
              <AccordionContent className="space-y-6 pt-4">
                <div className="space-y-2">
                  <Label className="text-base font-medium">Marital Status *</Label>
                  <Controller
                    name="maritalStatus"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="single" id="single" />
                          <Label htmlFor="single">Single</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="married" id="married" />
                          <Label htmlFor="married">Married</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="divorced" id="divorced" />
                          <Label htmlFor="divorced">Divorced</Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numberOfChildren" className="text-base font-medium">
                    Number of Children *
                  </Label>
                  <Controller
                    name="numberOfChildren"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger id="numberOfChildren">
                          <SelectValue placeholder="Select number of children" />
                        </SelectTrigger>
                        <SelectContent>
                          <ScrollArea className="h-72">
                            {Array.from({ length: 51 }, (_, i) => (
                              <SelectItem key={i} value={i.toString()}>
                                {i}
                              </SelectItem>
                            ))}
                          </ScrollArea>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-base font-medium">Disability *</Label>
                    <Controller
                      name="disability"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup onValueChange={field.onChange} value={field.value} className="flex space-x-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="disability-yes" />
                            <Label htmlFor="disability-yes">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="disability-no" />
                            <Label htmlFor="disability-no">No</Label>
                          </div>
                        </RadioGroup>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-medium">Tribal Mark *</Label>
                    <Controller
                      name="tribalMark"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup onValueChange={field.onChange} value={field.value} className="flex space-x-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="tribal-mark-yes" />
                            <Label htmlFor="tribal-mark-yes">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="tribal-mark-no" />
                            <Label htmlFor="tribal-mark-no">No</Label>
                          </div>
                        </RadioGroup>
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup" className="text-base font-medium">
                      Blood Group *
                    </Label>
                    <Controller
                      name="bloodGroup"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="bloodGroup" aria-invalid={!!errors.bloodGroup}>
                            <SelectValue placeholder="Select blood group" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A+">A+</SelectItem>
                            <SelectItem value="A-">A-</SelectItem>
                            <SelectItem value="B+">B+</SelectItem>
                            <SelectItem value="B-">B-</SelectItem>
                            <SelectItem value="AB+">AB+</SelectItem>
                            <SelectItem value="AB-">AB-</SelectItem>
                            <SelectItem value="O+">O+</SelectItem>
                            <SelectItem value="O-">O-</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.bloodGroup && <p className="text-sm text-red-500">{errors.bloodGroup.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="genotype" className="text-base font-medium">
                      Genotype *
                    </Label>
                    <Controller
                      name="genotype"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="genotype" aria-invalid={!!errors.genotype}>
                            <SelectValue placeholder="Select genotype" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AA">AA</SelectItem>
                            <SelectItem value="AS">AS</SelectItem>
                            <SelectItem value="AC">AC</SelectItem>
                            <SelectItem value="SS">SS</SelectItem>
                            <SelectItem value="SC">SC</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.genotype && <p className="text-sm text-red-500">{errors.genotype.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medicalStatus" className="text-base font-medium">
                    Medical Status
                  </Label>
                  <Textarea
                    id="medicalStatus"
                    placeholder="Enter any medical conditions (e.g., blind, handicapped, etc.)"
                    className="min-h-[80px]"
                    {...register("medicalStatus")}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="section-3">
              <AccordionTrigger className="text-lg font-semibold">Skills & Courses</AccordionTrigger>
              <AccordionContent className="space-y-6 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="skills" className="text-base font-medium">
                    Skills
                  </Label>
                  <Textarea
                    id="skills"
                    placeholder="Enter your skills"
                    className="min-h-[80px]"
                    {...register("skills")}
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="numberOfCourses" className="text-base font-medium">
                      Number of Courses Attended *
                    </Label>
                    <Controller
                      name="numberOfCourses"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="numberOfCourses">
                            <SelectValue placeholder="Select number of courses" />
                          </SelectTrigger>
                          <SelectContent>
                            <ScrollArea className="h-72">
                              {Array.from({ length: 51 }, (_, i) => (
                                <SelectItem key={i} value={i.toString()}>
                                  {i}
                                </SelectItem>
                              ))}
                            </ScrollArea>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  {Number.parseInt(watchNumberOfCourses) > 0 && (
                    <div className="space-y-4">
                      <Label className="text-base font-medium">List of Courses *</Label>
                      {courseFields.map((field, index) => (
                        <div key={field.id} className="space-y-1">
                          <Label htmlFor={`courses.${index}`} className="text-sm">
                            Course {index + 1}
                          </Label>
                          <Input
                            id={`courses.${index}`}
                            placeholder={`Enter course ${index + 1}`}
                            {...register(`courses.${index}` as const)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-medium">Appointments Held During Time in Service</Label>
                  <div className="space-y-4">
                    {appointmentFields.map((field, index) => (
                      <Input
                        key={field.id}
                        id={`appointments.${index}`}
                        placeholder={`Appointment ${index + 1}`}
                        {...register(`appointments.${index}` as const)}
                      />
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="section-4">
              <AccordionTrigger className="text-lg font-semibold">Last Unit Information</AccordionTrigger>
              <AccordionContent className="space-y-6 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="lastUnit" className="text-base font-medium">
                    Last Unit *
                  </Label>
                  <Input
                    id="lastUnit"
                    placeholder="Enter your last unit"
                    aria-invalid={!!errors.lastUnit}
                    {...register("lastUnit")}
                  />
                  {errors.lastUnit && <p className="text-sm text-red-500">{errors.lastUnit.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stateOfLastUnit" className="text-base font-medium">
                    State of Last Unit *
                  </Label>
                  <Controller
                    name="stateOfLastUnit"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger id="stateOfLastUnit" aria-invalid={!!errors.stateOfLastUnit}>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <ScrollArea className="h-72">
                            {nigerianStates.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </ScrollArea>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.stateOfLastUnit && <p className="text-sm text-red-500">{errors.stateOfLastUnit.message}</p>}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="section-5">
              <AccordionTrigger className="text-lg font-semibold">Next of Kin Information</AccordionTrigger>
              <AccordionContent className="space-y-6 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="nextOfKin.fullName" className="text-base font-medium">
                    Full Name *
                  </Label>
                  <Input
                    id="nextOfKin.fullName"
                    placeholder="Enter next of kin's full name"
                    aria-invalid={!!errors.nextOfKin?.fullName}
                    {...register("nextOfKin.fullName")}
                  />
                  {errors.nextOfKin?.fullName && (
                    <p className="text-sm text-red-500">{errors.nextOfKin.fullName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nextOfKin.relationship" className="text-base font-medium">
                    Relationship *
                  </Label>
                  <Input
                    id="nextOfKin.relationship"
                    placeholder="E.g., Spouse, Child, Parent, Sibling"
                    aria-invalid={!!errors.nextOfKin?.relationship}
                    {...register("nextOfKin.relationship")}
                  />
                  {errors.nextOfKin?.relationship && (
                    <p className="text-sm text-red-500">{errors.nextOfKin.relationship.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nextOfKin.address" className="text-base font-medium">
                    Address *
                  </Label>
                  <Textarea
                    id="nextOfKin.address"
                    placeholder="Enter next of kin's address"
                    className="min-h-[80px]"
                    aria-invalid={!!errors.nextOfKin?.address}
                    {...register("nextOfKin.address")}
                  />
                  {errors.nextOfKin?.address && (
                    <p className="text-sm text-red-500">{errors.nextOfKin.address.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nextOfKin.phoneNumber" className="text-base font-medium">
                    Phone Number *
                  </Label>
                  <Input
                    id="nextOfKin.phoneNumber"
                    placeholder="Enter 11-digit phone number"
                    aria-invalid={!!errors.nextOfKin?.phoneNumber}
                    {...register("nextOfKin.phoneNumber")}
                  />
                  {errors.nextOfKin?.phoneNumber && (
                    <p className="text-sm text-red-500">{errors.nextOfKin.phoneNumber.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nextOfKin.email" className="text-base font-medium">
                    Email
                  </Label>
                  <Input
                    id="nextOfKin.email"
                    placeholder="Enter next of kin's email (optional)"
                    type="email"
                    aria-invalid={!!errors.nextOfKin?.email}
                    {...register("nextOfKin.email")}
                  />
                  {errors.nextOfKin?.email && <p className="text-sm text-red-500">{errors.nextOfKin.email.message}</p>}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Please correct the errors in the form before submitting.</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

