"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, User, Camera, Brain, RotateCcw, Home, CheckCircle, AlertTriangle } from "lucide-react"
import Image from "next/image"

type Step = "info" | "upload" | "predict" | "result"

interface PatientInfo {
  name: string
  age: string
}

interface PredictionResult {
  confidence: number
  diagnosis: string
  recommendation: string
}

export default function SkinCancerDetection() {
  const [currentStep, setCurrentStep] = useState<Step>("info")
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({ name: "", age: "" })
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null)

  const handlePatientInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (patientInfo.name && patientInfo.age) {
      setCurrentStep("upload")
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePredict = async () => {
    setIsAnalyzing(true)
    setCurrentStep("predict")

    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Mock prediction result
    const mockResults = [
      {
        confidence: 92,
        diagnosis: "Benign Mole",
        recommendation: "Regular monitoring recommended. Schedule follow-up in 6 months.",
      },
      {
        confidence: 78,
        diagnosis: "Suspicious Lesion",
        recommendation: "Immediate dermatologist consultation recommended within 2 weeks.",
      },
      {
        confidence: 85,
        diagnosis: "Normal Skin",
        recommendation: "No immediate concerns. Continue regular skin self-examinations.",
      },
    ]

    const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)]
    setPredictionResult(randomResult)
    setIsAnalyzing(false)
    setCurrentStep("result")
  }

  const resetToUpload = () => {
    setUploadedImage(null)
    setCurrentStep("upload")
    setPredictionResult(null)
  }

  const returnHome = () => {
    setCurrentStep("info")
    setPatientInfo({ name: "", age: "" })
    setUploadedImage(null)
    setPredictionResult(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SkinAI Detector</h1>
              <p className="text-sm text-gray-600">Advanced Skin Cancer Detection System</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Patient Info Step */}
        {currentStep === "info" && (
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Patient Information</span>
                </CardTitle>
                <CardDescription>Please provide your basic information to begin the analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePatientInfoSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={patientInfo.name}
                      onChange={(e) => setPatientInfo((prev) => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Enter your age"
                      value={patientInfo.age}
                      onChange={(e) => setPatientInfo((prev) => ({ ...prev, age: e.target.value }))}
                      required
                      min="1"
                      max="120"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Continue to Image Upload
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Upload Step */}
        {currentStep === "upload" && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center space-x-2">
                  <Camera className="w-5 h-5" />
                  <span>Upload Skin Image</span>
                </CardTitle>
                <CardDescription>
                  Patient: {patientInfo.name}, Age: {patientInfo.age}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!uploadedImage ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Choose Skin Image</h3>
                    <p className="text-gray-600 mb-4">Upload a clear photo of the skin area you want to analyze</p>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <Label htmlFor="image-upload" className="cursor-pointer">
                      <Button type="button" className="bg-blue-600 hover:bg-blue-700">
                        Select Image
                      </Button>
                    </Label>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative w-full max-w-md mx-auto">
                      <Image
                        src={uploadedImage || "/placeholder.svg"}
                        alt="Uploaded skin image"
                        width={400}
                        height={300}
                        className="rounded-lg object-cover w-full"
                      />
                    </div>
                    <div className="flex space-x-3 justify-center">
                      <Button onClick={handlePredict} className="bg-green-600 hover:bg-green-700">
                        <Brain className="w-4 h-4 mr-2" />
                        Predict Skin Cancer
                      </Button>
                      <Button variant="outline" onClick={resetToUpload}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Upload Again
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Prediction Step */}
        {currentStep === "predict" && (
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Analyzing Image</CardTitle>
                <CardDescription>Our AI is examining your skin image...</CardDescription>
              </CardHeader>
              <CardContent className="text-center py-8">
                <div className="animate-spin w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">This may take a few moments</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Result Step */}
        {currentStep === "result" && predictionResult && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center space-x-2">
                  {predictionResult.diagnosis === "Normal Skin" || predictionResult.diagnosis === "Benign Mole" ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  )}
                  <span>Analysis Complete</span>
                </CardTitle>
                <CardDescription>
                  Patient: {patientInfo.name}, Age: {patientInfo.age}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Image
                      src={uploadedImage! || "/placeholder.svg"}
                      alt="Analyzed skin image"
                      width={300}
                      height={200}
                      className="rounded-lg object-cover w-full"
                    />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Diagnosis</h3>
                      <p className="text-2xl font-bold text-blue-600">{predictionResult.diagnosis}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Confidence Level</h3>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-blue-600 h-3 rounded-full transition-all duration-1000"
                          style={{ width: `${predictionResult.confidence}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{predictionResult.confidence}% confidence</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Recommendation</h3>
                  <p className="text-gray-700">{predictionResult.recommendation}</p>
                </div>

                <div className="flex space-x-3 justify-center">
                  <Button onClick={resetToUpload} variant="outline">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Upload Again
                  </Button>
                  <Button onClick={returnHome}>
                    <Home className="w-4 h-4 mr-2" />
                    Return Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          <p className="text-sm">
            <strong>Disclaimer:</strong> This tool is for educational purposes only and should not replace professional
            medical advice. Always consult with a qualified dermatologist for proper diagnosis and treatment.
          </p>
        </div>
      </footer>
    </div>
  )
}
