import { router } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Survey() {
  const [step, setStep] = useState(1);

  const [form, setForm] = useState<any>({});

  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);

  const updateField = (key: string, value: any) => {
    setForm({ ...form, [key]: value });
  };

  const submitSurvey = async () => {
    const res = await fetch("YOUR_API/risk_calculator_api.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    router.replace({
      pathname: "/result",
      params: {
        score: data.total_score,
        verdict: data.verdict,
        reportId: data.report_id || 1,
      },
    });
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Step {step} of 6</Text>

      {/* STEP RENDERING */}
      {step === 1 && (
        <>
          <Text>Property Type</Text>
          <TextInput onChangeText={(v) => updateField("property_type", v)} />
        </>
      )}

      {step === 2 && (
        <>
          <Text>Title Seen (yes/no)</Text>
          <TextInput onChangeText={(v) => updateField("title_seen", v)} />
        </>
      )}

      {step === 3 && (
        <>
          <Text>Zoning</Text>
          <TextInput onChangeText={(v) => updateField("zoning", v)} />
        </>
      )}

      {step === 4 && (
        <>
          <Text>Encroachment (yes/no)</Text>
          <TextInput onChangeText={(v) => updateField("encroachment", v)} />
        </>
      )}

      {step === 5 && (
        <>
          <Text>Owner Name</Text>
          <TextInput onChangeText={(v) => updateField("owner_name", v)} />
        </>
      )}

      {step === 6 && (
        <>
          <Text>Mortgage (yes/no)</Text>
          <TextInput onChangeText={(v) => updateField("mortgage", v)} />
        </>
      )}

      {/* NAVIGATION */}
      <View style={{ flexDirection: "row", marginTop: 20 }}>
        {step > 1 && (
          <TouchableOpacity onPress={handlePrev}>
            <Text>Previous</Text>
          </TouchableOpacity>
        )}

        {step < 6 ? (
          <TouchableOpacity onPress={handleNext}>
            <Text>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={submitSurvey}>
            <Text>Submit</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
