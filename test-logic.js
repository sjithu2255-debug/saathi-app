const bloodRequests = [
    { id: 1, patientName: "Vijayan" }
];
let alerts = [
    { id: 1, title: "Urgent A+ Blood Needed" }
];
const idToRemove = 'blood-1';

function testRemove(id) {
    let newBloodRequests = bloodRequests;
    let newAlerts = alerts;

    if (typeof id === 'string' && id.startsWith('blood-')) {
        const realId = parseInt(id.replace('blood-', ''), 10);
        newBloodRequests = newBloodRequests.filter(r => r.id !== realId);
    } else {
        newAlerts = newAlerts.filter(a => a.id !== id);
    }
    console.log("newBloodRequests:", newBloodRequests);
    console.log("newAlerts:", newAlerts);
}
testRemove(idToRemove);
