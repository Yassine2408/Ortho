import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://ihxojnbpnpbtkdqkproy.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloeG9qbmJwbnBidGtxZGtwcm95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNzg4NTYsImV4cCI6MjA2NDY1NDg1Nn0.Fm6Vzo2ZrERTRDlRwbsc__-10XaCQlaKwO4iAawJWro'
const supabase = createClient(supabaseUrl, supabaseKey)

// Example: Add a patient
async function addPatient(nom, date_debut, objectif) {
  const { data, error } = await supabase
    .from('patients')
    .insert([{ nom, date_debut, objectif }])
  return { data, error }
}

// Example: Add a session
async function addSession(patient_id, date, heure, type_seance, paiement, observations) {
  const { data, error } = await supabase
    .from('sessions')
    .insert([{ patient_id, date, heure, type_seance, paiement, observations }])
  return { data, error }
}

async function saveToSupabase() {
    // Patient data
    const patientName = document.getElementById('patientName').value || 'Nom du patient';
    const startDate = document.getElementById('startDate').value || new Date().toISOString().split('T')[0];
    const objective = document.getElementById('objective').value || 'Objectif du suivi à définir';

    // Insert patient
    const { data: patient, error: patientError } = await supabase
        .from('patients')
        .insert([{ nom: patientName, date_debut: startDate, objectif: objective }])
        .select()
        .single();

    if (patientError) {
        alert('Erreur lors de l\'enregistrement du patient : ' + patientError.message);
        return;
    }

    // Gather sessions
    const sessions = [];
    document.querySelectorAll('.session-card').forEach(card => {
        const date = card.querySelector('.session-date').value;
        const heure = card.querySelector('.session-time').value;
        const type = card.querySelector('.session-type').value;
        const paiement = card.querySelector('.session-payment').value;
        const observations = card.querySelector('.session-notes').value;
        if (date || heure || type || paiement || observations) {
            sessions.push({ date, heure, type_seance: type, paiement: parseFloat(paiement) || 0, observations });
        }
    });

    // Insert sessions
    for (const session of sessions) {
        await supabase
            .from('sessions')
            .insert([{ ...session, patient_id: patient.id }]);
    }

    alert('Données enregistrées avec succès dans la base de données !');
}

window.saveToSupabase = saveToSupabase;

document.getElementById('generateBtn').addEventListener('click', () => {
    saveToSupabase();
    generateDocument();
});
