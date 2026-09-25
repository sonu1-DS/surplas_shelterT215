/* =========================================================
   SURPLUS-TO-SHELTER MULTI-LANGUAGE SYSTEM
========================================================= */

const translations = {

  /* =======================================================
     ENGLISH
  ======================================================= */

  en: {

    /* ---------------- COMMON / NAV ---------------- */

    "nav.home": "Home",
    "nav.donate": "Donate",
    "nav.shelter": "Shelter",
    "nav.driver": "Driver",
    "nav.map": "Live Map",
    "nav.impact": "Impact",
    "nav.notifications": "Notifications",

    "language.label": "Language",
    "language.english": "English",
    "language.hindi": "हिन्दी",

    "common.live": "Live",
    "common.update": "Update",
    "common.loading": "Loading...",
    "common.cancel": "Cancel",
    "common.yes": "Yes",
    "common.no": "No",


    /* ---------------- HOME ---------------- */

    "home.eyebrow":
      "Real-Time Food Rescue Network",

    "home.title":
      "Turn surplus food into someone's next meal",

    "home.description":
      "Connect donors, shelters and rescue drivers to safely redirect surplus food before it goes to waste.",

    "home.donateButton":
      "Donate Food",

    "home.liveMapButton":
      "View Live Map",

    "home.howTitle":
      "How food rescue works",

    "home.step1.title":
      "Post surplus food",

    "home.step1.description":
      "Donors quickly share available food, quantity, pickup location and safety window.",

    "home.step2.title":
      "Smart Match",

    "home.step2.description":
      "The system finds the best eligible shelter using distance, capacity, food safety and recipient need.",

    "home.step3.title":
      "Driver rescue",

    "home.step3.description":
      "A rescue driver collects the donation and delivers it to the assigned shelter.",

    "home.step4.title":
      "Track impact",

    "home.step4.description":
      "Successful rescues update meals saved, food rescued and impact analytics.",


    /* ---------------- DONOR ---------------- */

    "donor.eyebrow":
      "🍽 Food Donor Portal",

    "donor.title":
      "Rescue your surplus food",

    "donor.description":
      "Tell us what food is available. Our Need-Aware Smart Match engine compares eligible shelters and selects the best rescue destination before the food expires.",

    "donor.formTitle":
      "Post a new donation",

    "donor.formDescription":
      "Takes less than a minute.",

    "donor.businessName":
      "Restaurant or business name",

    "donor.businessPlaceholder":
      "e.g. Rajwada Restaurant",

    "donor.food":
      "What food is available?",

    "donor.foodPlaceholder":
      "e.g. Veg biryani, dal and roti",

    "donor.portions":
      "Number of portions",

    "donor.safeFor":
      "Safe for the next",

    "donor.hour1":
      "1 hour",

    "donor.hour2":
      "2 hours",

    "donor.hour4":
      "4 hours",

    "donor.hour6":
      "6 hours",

    "donor.pickupArea":
      "Pickup area",

    "donor.locationInfo":
      "📍 Smart Match checks eligible shelters around this pickup location.",

    "donor.findShelter":
      "Find Best Shelter →",

    "donor.calculating":
      "Calculating Need-Aware Match...",

    "donor.smartMatchWorks":
      "How Smart Match works",

    "donor.smartMatchDescription":
      "Every eligible shelter receives an explainable score out of 100. The highest-scoring safe option is selected.",

    "donor.distance":
      "Distance — 40 points",

    "donor.distanceDesc":
      "Nearby eligible shelters receive a stronger routing score.",

    "donor.capacity":
      "Capacity Fit — 25 points",

    "donor.capacityDesc":
      "The shelter must have enough capacity for the donation.",

    "donor.safety":
      "Food Safety — 15 points",

    "donor.safetyDesc":
      "Food must be able to arrive before its safe-use window ends.",

    "donor.need":
      "Recipient Need — 20 points",

    "donor.needDesc":
      "Shelters reporting higher current food need receive additional priority.",

    "donor.rescueScore":
      "Best Rescue Score",

    "donor.rescueScoreDesc":
      "The safest eligible shelter with the strongest combined score wins.",

    "donor.foodSafety":
      "🛡 Food safety first",

    "donor.foodSafetyDesc":
      "Only list food that is currently safe to eat. An accurate safety window helps the system avoid unsafe rescue assignments.",

    "donor.matchFound":
      "Need-Aware Smart Match Found!",

    "donor.matchFoundDesc":
      "The best eligible recipient has been selected automatically.",

    "donor.matchedShelter":
      "MATCHED SHELTER",

    "donor.smartScore":
      "NEED-AWARE SMART RESCUE SCORE",

    "donor.estimatedArrival":
      "Estimated arrival",

    "donor.safetyMargin":
      "Safety margin",

    "donor.recipientNeed":
      "Recipient need",

    "donor.whyShelter":
      "🧠 Why this shelter?",

    "donor.enoughCapacity":
      "Enough capacity for {count} portions",

    "donor.safeArrival":
      "Food can arrive before its safety window ends",

    "donor.currentNeed":
      "Current recipient need: {need}",

    "donor.highestScore":
      "Highest combined Rescue Score among eligible shelters",

    "donor.currentStatus":
      "Current status:",

    "donor.waitingConfirmation":
      "Waiting for shelter confirmation",

    "donor.shelterReview":
      "🏠 The shelter can now review and accept this donation.",

    "donor.noMatch":
      "No safe shelter match found.",


    /* ---------------- SHELTER ---------------- */

    "shelter.eyebrow":
      "🏠 Shelter Portal",

    "shelter.title":
      "Incoming food rescues",

    "shelter.description":
      "Set your shelter's current food need, review Smart Matches and prioritize time-sensitive donations before their safety window expires.",

    "shelter.select":
      "Select your shelter",

    "shelter.capacity":
      "Shelter capacity",

    "shelter.portions":
      "portions",

    "shelter.currentFoodNeed":
      "Current food need",

    "shelter.lowNeed":
      "Low Need",

    "shelter.mediumNeed":
      "Medium Need",

    "shelter.highNeed":
      "High Need",

    "shelter.current":
      "Current:",

    "shelter.matchedDonations":
      "Matched donations",

    "shelter.needAware":
      "Need-aware Smart Match",

    "shelter.needAwareDesc":
      "The matching engine considers four factors instead of simply selecting the nearest shelter.",

    "shelter.distance":
      "Distance — 40 points",

    "shelter.capacityFit":
      "Capacity fit — 25 points",

    "shelter.foodSafety":
      "Food safety — 15 points",

    "shelter.recipientNeed":
      "Recipient need — 20 points",

    "shelter.accept":
      "✓ Accept Donation",

    "shelter.reject":
      "Reject",

    "shelter.accepting":
      "Accepting...",

    "shelter.rejecting":
      "Rejecting...",

    "shelter.waitingDriver":
      "✓ Accepted — waiting for driver",

    "shelter.noFood":
      "No incoming food right now",

    "shelter.noFoodDesc":
      "New Need-Aware Smart Matches will appear here automatically.",

    "shelter.needUpdated":
      "{name} need updated to {need} ✓ Future Smart Matches will use this value.",


    /* ---------------- DRIVER ---------------- */

    "driver.eyebrow":
      "🚗 Rescue Driver Portal",

    "driver.title":
      "Your rescue missions",

    "driver.description":
      "Urgent rescues automatically move to the top. Follow live pickup and shelter information, recipient need and navigation to complete each rescue safely.",

    "driver.waitingPickup":
      "Waiting for pickup",

    "driver.carrying":
      "Currently carrying",

    "driver.activeJobs":
      "Active rescue jobs",

    "driver.priorityQueue":
      "Priority pickup queue",

    "driver.workflow":
      "Smart driver workflow",

    "driver.workflowDesc":
      "Rescue jobs are prioritized by remaining food-safety time and include direct navigation to the next required stop.",

    "driver.priorityFirst":
      "Priority first",

    "driver.priorityFirstDesc":
      "Critical and high-risk rescues automatically move to the top.",

    "driver.needVisibility":
      "Recipient need visibility",

    "driver.needVisibilityDesc":
      "See whether the assigned shelter currently reports low, medium or high food need.",

    "driver.navigation":
      "Navigate to next stop",

    "driver.navigationDesc":
      "Open Google Maps directly to the pickup point or assigned shelter.",

    "driver.collectFood":
      "Collect food",

    "driver.collectFoodDesc":
      "Mark Picked Up after collection to switch navigation to the shelter.",

    "driver.complete":
      "Complete rescue",

    "driver.completeDesc":
      "Mark Delivered to update the impact dashboard.",

    "driver.rescueRoute":
      "🧭 Rescue route",

    "driver.pickupFrom":
      "Pick up from",

    "driver.deliverTo":
      "Deliver to",

    "driver.navigatePickup":
      "🧭 Navigate to Pickup",

    "driver.navigateShelter":
      "🧭 Navigate to Shelter",

    "driver.liveMap":
      "🗺 View Live Map",

    "driver.markPickup":
      "📦 Mark Picked Up",

    "driver.markDelivered":
      "✓ Mark Delivered",

    "driver.foodWithDriver":
      "Food is with driver",

    "driver.needAwareInfo":
      "NEED-AWARE SMART RESCUE INFORMATION",

    "driver.noJobs":
      "No rescue jobs waiting",

    "driver.noJobsDesc":
      "Jobs automatically appear here after a shelter accepts a donation.",


    /* ---------------- MAP ---------------- */

    "map.eyebrow":
      "🗺 Live Rescue Network",

    "map.title":
      "Live food rescue map",

    "map.description":
      "Track active donations and partner shelters across the rescue network.",

    "map.partnerShelters":
      "Partner shelters",

    "map.activeRescues":
      "Active rescues",

    "map.urgentRescues":
      "Urgent rescues",

    "map.guide":
      "Map guide",

    "map.shelter":
      "Shelter",

    "map.donation":
      "Food donation",

    "map.refresh":
      "Map refreshes automatically.",


    /* ---------------- DASHBOARD ---------------- */

    "dashboard.eyebrow":
      "📊 Live Impact Analytics",

    "dashboard.title":
      "Rescue impact dashboard",

    "dashboard.description":
      "Track rescued food, successful deliveries, active missions, automatic recovery and the operational performance of the Surplus-to-Shelter network.",

    "dashboard.liveData":
      "Live data",

    "dashboard.mealsSaved":
      "Meals Saved",

    "dashboard.mealsSavedDesc":
      "Portions successfully delivered",

    "dashboard.foodRescued":
      "Food Rescued",

    "dashboard.foodRescuedDesc":
      "Estimated at 0.4 kg per portion",

    "dashboard.co2":
      "CO₂e Avoided",

    "dashboard.co2Desc":
      "Estimated food-waste impact",

    "dashboard.partnerShelters":
      "Partner Shelters",

    "dashboard.partnerSheltersDesc":
      "Available rescue destinations",

    "dashboard.delivered":
      "Delivered Rescues",

    "dashboard.deliveredDesc":
      "Completed donor-to-shelter missions",

    "dashboard.active":
      "Active Rescues",

    "dashboard.activeDesc":
      "Matched, accepted or in transit",

    "dashboard.rematches":
      "Auto Re-Matches",

    "dashboard.rematchesDesc":
      "Successful automatic shelter reassignments",

    "dashboard.successRate":
      "Delivery Success Rate",

    "dashboard.successRateDesc":
      "Delivered vs terminal rescue outcomes",

    "dashboard.statusOverview":
      "Rescue status overview",

    "dashboard.currentRecords":
      "Current donation records",

    "dashboard.operationalHealth":
      "Operational health",

    "dashboard.deliverySuccess":
      "Delivery success",

    "dashboard.activeQueue":
      "Active rescue queue",

    "dashboard.autoRecovery":
      "Auto recovery events",

    "dashboard.failedExpired":
      "Failed / expired",

    "dashboard.recentActivity":
      "Recent rescue activity",

    "dashboard.notificationStream":
      "Notification stream",

    "dashboard.reset":
      "🧹 Reset Demo Data",

    "dashboard.resetQuestion":
      "Reset demo data?",

    "dashboard.resetConfirm":
      "Reset Demo Data",


    /* ---------------- NEED LABELS ---------------- */

    "need.low":
      "Low",

    "need.medium":
      "Medium",

    "need.high":
      "High",


    /* ---------------- PRIORITY ---------------- */

    "priority.low":
      "LOW PRIORITY",

    "priority.medium":
      "MEDIUM PRIORITY",

    "priority.high":
      "HIGH PRIORITY",

    "priority.critical":
      "CRITICAL PRIORITY",

    "priority.expired":
      "EXPIRED"

  },


  /* =======================================================
     HINDI
  ======================================================= */

  hi: {

    /* ---------------- COMMON / NAV ---------------- */

    "nav.home": "होम",
    "nav.donate": "दान करें",
    "nav.shelter": "आश्रय केंद्र",
    "nav.driver": "ड्राइवर",
    "nav.map": "लाइव मानचित्र",
    "nav.impact": "प्रभाव",
    "nav.notifications": "नोटिफिकेशन",

    "language.label": "भाषा",
    "language.english": "English",
    "language.hindi": "हिन्दी",

    "common.live": "लाइव",
    "common.update": "अपडेट करें",
    "common.loading": "लोड हो रहा है...",
    "common.cancel": "रद्द करें",
    "common.yes": "हाँ",
    "common.no": "नहीं",


    /* ---------------- HOME ---------------- */

    "home.eyebrow":
      "रियल-टाइम भोजन बचाव नेटवर्क",

    "home.title":
      "अतिरिक्त भोजन को किसी की अगली थाली तक पहुँचाएँ",

    "home.description":
      "दानदाताओं, आश्रय केंद्रों और बचाव ड्राइवरों को जोड़कर अतिरिक्त भोजन को बर्बाद होने से पहले सुरक्षित रूप से पहुँचाएँ।",

    "home.donateButton":
      "भोजन दान करें",

    "home.liveMapButton":
      "लाइव मानचित्र देखें",

    "home.howTitle":
      "भोजन बचाव कैसे काम करता है",

    "home.step1.title":
      "अतिरिक्त भोजन पोस्ट करें",

    "home.step1.description":
      "दानदाता उपलब्ध भोजन, मात्रा, पिकअप स्थान और सुरक्षित समय की जानकारी देते हैं।",

    "home.step2.title":
      "स्मार्ट मैच",

    "home.step2.description":
      "सिस्टम दूरी, क्षमता, भोजन सुरक्षा और प्राप्तकर्ता की आवश्यकता के आधार पर सही आश्रय केंद्र चुनता है।",

    "home.step3.title":
      "ड्राइवर बचाव",

    "home.step3.description":
      "बचाव ड्राइवर भोजन को लेकर निर्धारित आश्रय केंद्र तक पहुँचाता है।",

    "home.step4.title":
      "प्रभाव देखें",

    "home.step4.description":
      "सफल बचाव के बाद बचाए गए भोजन और प्रभाव के आँकड़े अपडेट होते हैं।",


    /* ---------------- DONOR ---------------- */

    "donor.eyebrow":
      "🍽 भोजन दाता पोर्टल",

    "donor.title":
      "अपने अतिरिक्त भोजन को बचाएँ",

    "donor.description":
      "बताएँ कि कौन-सा भोजन उपलब्ध है। हमारा आवश्यकता-आधारित स्मार्ट मैच सिस्टम योग्य आश्रय केंद्रों की तुलना कर भोजन के खराब होने से पहले सबसे उपयुक्त केंद्र चुनता है।",

    "donor.formTitle":
      "नया भोजन दान पोस्ट करें",

    "donor.formDescription":
      "एक मिनट से भी कम समय लगेगा।",

    "donor.businessName":
      "रेस्तरां या व्यवसाय का नाम",

    "donor.businessPlaceholder":
      "जैसे: राजवाड़ा रेस्टोरेंट",

    "donor.food":
      "कौन-सा भोजन उपलब्ध है?",

    "donor.foodPlaceholder":
      "जैसे: वेज बिरयानी, दाल और रोटी",

    "donor.portions":
      "भोजन की मात्रा",

    "donor.safeFor":
      "अगले इतने समय तक सुरक्षित",

    "donor.hour1":
      "1 घंटा",

    "donor.hour2":
      "2 घंटे",

    "donor.hour4":
      "4 घंटे",

    "donor.hour6":
      "6 घंटे",

    "donor.pickupArea":
      "पिकअप क्षेत्र",

    "donor.locationInfo":
      "📍 स्मार्ट मैच इस पिकअप स्थान के आसपास योग्य आश्रय केंद्रों की जाँच करता है।",

    "donor.findShelter":
      "सर्वश्रेष्ठ आश्रय खोजें →",

    "donor.calculating":
      "आवश्यकता-आधारित स्मार्ट मैच खोजा जा रहा है...",

    "donor.smartMatchWorks":
      "स्मार्ट मैच कैसे काम करता है",

    "donor.smartMatchDescription":
      "प्रत्येक योग्य आश्रय केंद्र को 100 में से एक स्पष्ट स्कोर मिलता है। सबसे अधिक स्कोर वाला सुरक्षित विकल्प चुना जाता है।",

    "donor.distance":
      "दूरी — 40 अंक",

    "donor.distanceDesc":
      "पास के योग्य आश्रय केंद्रों को अधिक दूरी स्कोर मिलता है।",

    "donor.capacity":
      "क्षमता — 25 अंक",

    "donor.capacityDesc":
      "आश्रय केंद्र में पूरे भोजन दान को लेने की पर्याप्त क्षमता होनी चाहिए।",

    "donor.safety":
      "भोजन सुरक्षा — 15 अंक",

    "donor.safetyDesc":
      "भोजन को सुरक्षित समय समाप्त होने से पहले पहुँच पाना चाहिए।",

    "donor.need":
      "प्राप्तकर्ता की आवश्यकता — 20 अंक",

    "donor.needDesc":
      "जिन आश्रय केंद्रों को भोजन की अधिक आवश्यकता है उन्हें अतिरिक्त प्राथमिकता मिलती है।",

    "donor.rescueScore":
      "सर्वश्रेष्ठ बचाव स्कोर",

    "donor.rescueScoreDesc":
      "सबसे मजबूत संयुक्त स्कोर वाला सुरक्षित आश्रय केंद्र चुना जाता है।",

    "donor.foodSafety":
      "🛡 भोजन सुरक्षा पहले",

    "donor.foodSafetyDesc":
      "केवल वही भोजन सूचीबद्ध करें जो अभी खाने के लिए सुरक्षित है। सही सुरक्षा समय सिस्टम को असुरक्षित बचाव से बचाता है।",

    "donor.matchFound":
      "आवश्यकता-आधारित स्मार्ट मैच मिल गया!",

    "donor.matchFoundDesc":
      "सबसे उपयुक्त योग्य प्राप्तकर्ता स्वतः चुन लिया गया है।",

    "donor.matchedShelter":
      "चुना गया आश्रय केंद्र",

    "donor.smartScore":
      "आवश्यकता-आधारित स्मार्ट बचाव स्कोर",

    "donor.estimatedArrival":
      "अनुमानित पहुँच समय",

    "donor.safetyMargin":
      "सुरक्षा समय",

    "donor.recipientNeed":
      "प्राप्तकर्ता की आवश्यकता",

    "donor.whyShelter":
      "🧠 यह आश्रय क्यों?",

    "donor.enoughCapacity":
      "{count} भोजन के लिए पर्याप्त क्षमता",

    "donor.safeArrival":
      "भोजन सुरक्षित समय समाप्त होने से पहले पहुँच सकता है",

    "donor.currentNeed":
      "वर्तमान प्राप्तकर्ता आवश्यकता: {need}",

    "donor.highestScore":
      "सभी योग्य आश्रय केंद्रों में सबसे अधिक संयुक्त बचाव स्कोर",

    "donor.currentStatus":
      "वर्तमान स्थिति:",

    "donor.waitingConfirmation":
      "आश्रय केंद्र की पुष्टि का इंतजार",

    "donor.shelterReview":
      "🏠 आश्रय केंद्र अब इस भोजन दान की समीक्षा करके स्वीकार कर सकता है।",

    "donor.noMatch":
      "कोई सुरक्षित आश्रय मैच नहीं मिला।",


    /* ---------------- SHELTER ---------------- */

    "shelter.eyebrow":
      "🏠 आश्रय केंद्र पोर्टल",

    "shelter.title":
      "आने वाले भोजन बचाव",

    "shelter.description":
      "अपने आश्रय केंद्र की वर्तमान भोजन आवश्यकता सेट करें, स्मार्ट मैच देखें और समय-संवेदनशील भोजन को प्राथमिकता दें।",

    "shelter.select":
      "अपना आश्रय केंद्र चुनें",

    "shelter.capacity":
      "आश्रय क्षमता",

    "shelter.portions":
      "भोजन",

    "shelter.currentFoodNeed":
      "वर्तमान भोजन आवश्यकता",

    "shelter.lowNeed":
      "कम आवश्यकता",

    "shelter.mediumNeed":
      "मध्यम आवश्यकता",

    "shelter.highNeed":
      "अधिक आवश्यकता",

    "shelter.current":
      "वर्तमान:",

    "shelter.matchedDonations":
      "मिले हुए भोजन दान",

    "shelter.needAware":
      "आवश्यकता-आधारित स्मार्ट मैच",

    "shelter.needAwareDesc":
      "मैचिंग सिस्टम केवल सबसे नजदीकी आश्रय चुनने के बजाय चार कारकों को देखता है।",

    "shelter.distance":
      "दूरी — 40 अंक",

    "shelter.capacityFit":
      "क्षमता — 25 अंक",

    "shelter.foodSafety":
      "भोजन सुरक्षा — 15 अंक",

    "shelter.recipientNeed":
      "प्राप्तकर्ता आवश्यकता — 20 अंक",

    "shelter.accept":
      "✓ भोजन स्वीकार करें",

    "shelter.reject":
      "अस्वीकार करें",

    "shelter.accepting":
      "स्वीकार किया जा रहा है...",

    "shelter.rejecting":
      "अस्वीकार किया जा रहा है...",

    "shelter.waitingDriver":
      "✓ स्वीकार किया गया — ड्राइवर का इंतजार",

    "shelter.noFood":
      "अभी कोई आने वाला भोजन नहीं है",

    "shelter.noFoodDesc":
      "नए आवश्यकता-आधारित स्मार्ट मैच यहाँ स्वतः दिखाई देंगे।",

    "shelter.needUpdated":
      "{name} की आवश्यकता {need} पर अपडेट हो गई ✓ आगे के स्मार्ट मैच इस मान का उपयोग करेंगे।",


    /* ---------------- DRIVER ---------------- */

    "driver.eyebrow":
      "🚗 बचाव ड्राइवर पोर्टल",

    "driver.title":
      "आपके बचाव कार्य",

    "driver.description":
      "अधिक जरूरी बचाव स्वतः ऊपर आते हैं। पिकअप, आश्रय जानकारी, प्राप्तकर्ता आवश्यकता और नेविगेशन देखकर भोजन सुरक्षित रूप से पहुँचाएँ।",

    "driver.waitingPickup":
      "पिकअप का इंतजार",

    "driver.carrying":
      "अभी वाहन में भोजन",

    "driver.activeJobs":
      "सक्रिय बचाव कार्य",

    "driver.priorityQueue":
      "प्राथमिकता पिकअप सूची",

    "driver.workflow":
      "स्मार्ट ड्राइवर प्रक्रिया",

    "driver.workflowDesc":
      "बचाव कार्य भोजन के बचे हुए सुरक्षित समय के अनुसार प्राथमिकता में आते हैं और अगले स्थान का नेविगेशन देते हैं।",

    "driver.priorityFirst":
      "जरूरी कार्य पहले",

    "driver.priorityFirstDesc":
      "गंभीर और उच्च जोखिम वाले बचाव स्वतः ऊपर आते हैं।",

    "driver.needVisibility":
      "प्राप्तकर्ता आवश्यकता",

    "driver.needVisibilityDesc":
      "देखें कि निर्धारित आश्रय केंद्र में भोजन की आवश्यकता कम, मध्यम या अधिक है।",

    "driver.navigation":
      "अगले स्थान पर जाएँ",

    "driver.navigationDesc":
      "पिकअप स्थान या आश्रय केंद्र के लिए सीधे Google Maps खोलें।",

    "driver.collectFood":
      "भोजन लें",

    "driver.collectFoodDesc":
      "भोजन लेने के बाद पिकअप पूरा चिह्नित करें।",

    "driver.complete":
      "बचाव पूरा करें",

    "driver.completeDesc":
      "डिलीवरी पूरी करके प्रभाव डैशबोर्ड अपडेट करें।",

    "driver.rescueRoute":
      "🧭 बचाव मार्ग",

    "driver.pickupFrom":
      "यहाँ से भोजन लें",

    "driver.deliverTo":
      "यहाँ पहुँचाएँ",

    "driver.navigatePickup":
      "🧭 पिकअप स्थान पर जाएँ",

    "driver.navigateShelter":
      "🧭 आश्रय केंद्र पर जाएँ",

    "driver.liveMap":
      "🗺 लाइव मानचित्र देखें",

    "driver.markPickup":
      "📦 पिकअप पूरा करें",

    "driver.markDelivered":
      "✓ डिलीवरी पूरी करें",

    "driver.foodWithDriver":
      "भोजन ड्राइवर के पास है",

    "driver.needAwareInfo":
      "आवश्यकता-आधारित स्मार्ट बचाव जानकारी",

    "driver.noJobs":
      "कोई बचाव कार्य प्रतीक्षा में नहीं है",

    "driver.noJobsDesc":
      "आश्रय केंद्र द्वारा भोजन स्वीकार करने के बाद कार्य यहाँ स्वतः दिखाई देगा।",


    /* ---------------- MAP ---------------- */

    "map.eyebrow":
      "🗺 लाइव बचाव नेटवर्क",

    "map.title":
      "लाइव भोजन बचाव मानचित्र",

    "map.description":
      "सक्रिय भोजन दान और साझेदार आश्रय केंद्रों को लाइव मानचित्र पर देखें।",

    "map.partnerShelters":
      "साझेदार आश्रय केंद्र",

    "map.activeRescues":
      "सक्रिय बचाव",

    "map.urgentRescues":
      "जरूरी बचाव",

    "map.guide":
      "मानचित्र मार्गदर्शिका",

    "map.shelter":
      "आश्रय केंद्र",

    "map.donation":
      "भोजन दान",

    "map.refresh":
      "मानचित्र स्वतः अपडेट होता है।",


    /* ---------------- DASHBOARD ---------------- */

    "dashboard.eyebrow":
      "📊 लाइव प्रभाव विश्लेषण",

    "dashboard.title":
      "बचाव प्रभाव डैशबोर्ड",

    "dashboard.description":
      "बचाए गए भोजन, सफल डिलीवरी, सक्रिय कार्य और Surplus-to-Shelter नेटवर्क के प्रभाव को देखें।",

    "dashboard.liveData":
      "लाइव डेटा",

    "dashboard.mealsSaved":
      "बचाया गया भोजन",

    "dashboard.mealsSavedDesc":
      "सफलतापूर्वक पहुँचाए गए भोजन",

    "dashboard.foodRescued":
      "बचाया गया खाद्य",

    "dashboard.foodRescuedDesc":
      "प्रति भोजन 0.4 किग्रा का अनुमान",

    "dashboard.co2":
      "CO₂e बचत",

    "dashboard.co2Desc":
      "खाद्य अपशिष्ट से बचाव का अनुमान",

    "dashboard.partnerShelters":
      "साझेदार आश्रय",

    "dashboard.partnerSheltersDesc":
      "उपलब्ध बचाव गंतव्य",

    "dashboard.delivered":
      "पूरे हुए बचाव",

    "dashboard.deliveredDesc":
      "दाता से आश्रय तक पूरे हुए कार्य",

    "dashboard.active":
      "सक्रिय बचाव",

    "dashboard.activeDesc":
      "मैच, स्वीकार या रास्ते में",

    "dashboard.rematches":
      "स्वचालित पुनः मैच",

    "dashboard.rematchesDesc":
      "सफल स्वचालित आश्रय पुनः आवंटन",

    "dashboard.successRate":
      "डिलीवरी सफलता दर",

    "dashboard.successRateDesc":
      "सफल डिलीवरी बनाम अंतिम परिणाम",

    "dashboard.statusOverview":
      "बचाव स्थिति सारांश",

    "dashboard.currentRecords":
      "वर्तमान भोजन दान रिकॉर्ड",

    "dashboard.operationalHealth":
      "संचालन स्थिति",

    "dashboard.deliverySuccess":
      "डिलीवरी सफलता",

    "dashboard.activeQueue":
      "सक्रिय बचाव सूची",

    "dashboard.autoRecovery":
      "स्वचालित पुनः आवंटन",

    "dashboard.failedExpired":
      "विफल / समय समाप्त",

    "dashboard.recentActivity":
      "हाल की बचाव गतिविधि",

    "dashboard.notificationStream":
      "सूचना गतिविधि",

    "dashboard.reset":
      "🧹 डेमो डेटा रीसेट करें",

    "dashboard.resetQuestion":
      "डेमो डेटा रीसेट करें?",

    "dashboard.resetConfirm":
      "डेमो डेटा रीसेट करें",


    /* ---------------- NEED ---------------- */

    "need.low":
      "कम",

    "need.medium":
      "मध्यम",

    "need.high":
      "अधिक",


    /* ---------------- PRIORITY ---------------- */

    "priority.low":
      "कम प्राथमिकता",

    "priority.medium":
      "मध्यम प्राथमिकता",

    "priority.high":
      "उच्च प्राथमिकता",

    "priority.critical":
      "अत्यंत जरूरी",

    "priority.expired":
      "समय समाप्त"

  }

};


/* =========================================================
   CURRENT LANGUAGE
========================================================= */

const LANGUAGE_STORAGE_KEY =
  "sts_language";


function getCurrentLanguage(){

  const saved =
    localStorage.getItem(
      LANGUAGE_STORAGE_KEY
    );


  if(
    saved
    &&
    translations[saved]
  ){

    return saved;

  }


  return "en";

}


/* =========================================================
   TRANSLATION FUNCTION
========================================================= */

function t(
  key,
  variables = {}
){

  const language =
    getCurrentLanguage();


  let text =

    translations[language]?.[key]

    ??

    translations.en?.[key]

    ??

    key;


  Object.entries(
    variables
  )
  .forEach(
    ([name,value]) => {

      text = text.replaceAll(

        `{${name}}`,

        value

      );

    }
  );


  return text;

}


/* =========================================================
   APPLY STATIC HTML TRANSLATIONS
========================================================= */

function applyTranslations(){

  const language =
    getCurrentLanguage();


  document.documentElement.lang =

    language === "hi"

    ?

    "hi"

    :

    "en";


  /*
    Normal element text
  */

  document
  .querySelectorAll(
    "[data-i18n]"
  )
  .forEach(
    element => {

      const key =
        element.dataset.i18n;


      element.textContent =
        t(
          key
        );

    }
  );


  /*
    Placeholder
  */

  document
  .querySelectorAll(
    "[data-i18n-placeholder]"
  )
  .forEach(
    element => {

      element.placeholder =
        t(
          element.dataset.i18nPlaceholder
        );

    }
  );


  /*
    Title
  */

  document
  .querySelectorAll(
    "[data-i18n-title]"
  )
  .forEach(
    element => {

      element.title =
        t(
          element.dataset.i18nTitle
        );

    }
  );


  /*
    Keep selectors synced
  */

  document
  .querySelectorAll(
    ".language-selector"
  )
  .forEach(
    selector => {

      selector.value =
        language;

    }
  );

}


/* =========================================================
   CHANGE LANGUAGE
========================================================= */

function setLanguage(language){

  if(
    !translations[language]
  ){

    return;

  }


  localStorage.setItem(
    LANGUAGE_STORAGE_KEY,
    language
  );


  applyTranslations();


  window.dispatchEvent(

    new CustomEvent(

      "languagechange",

      {

        detail:{
          language
        }

      }

    )

  );

}


/* =========================================================
   LANGUAGE SELECTOR EVENTS
========================================================= */

function setupLanguageSelectors(){

  document
  .querySelectorAll(
    ".language-selector"
  )
  .forEach(
    selector => {

      selector.value =
        getCurrentLanguage();


      selector.addEventListener(

        "change",

        event => {

          setLanguage(
            event.target.value
          );

        }

      );

    }
  );

}


/* =========================================================
   GLOBAL NOTIFICATION BELL
========================================================= */

const GLOBAL_NOTIFICATION_REFRESH_MS =
  5000;


let globalNotificationTimer =
  null;


/* =========================================================
   GLOBAL BELL CSS
========================================================= */

function setupGlobalNotificationStyles(){

  if(
    document.getElementById(
      "sts-global-notification-styles"
    )
  ){

    return;

  }


  const style =
    document.createElement(
      "style"
    );


  style.id =
    "sts-global-notification-styles";


  style.textContent = `

    nav a.notification-nav{

      position:relative;

      display:inline-flex;

      align-items:center;

      justify-content:center;

      min-width:28px;

      font-size:18px;

    }


    nav a.notification-nav .nav-badge{

      position:absolute;

      top:-11px;

      right:-12px;

      min-width:20px;

      height:20px;

      padding:0 5px;

      display:flex;

      align-items:center;

      justify-content:center;

      background:#c93c2d;

      color:#ffffff;

      border:2px solid #ffffff;

      border-radius:20px;

      font-size:10px;

      font-weight:800;

      line-height:1;

    }


    nav a.notification-nav .nav-badge[hidden]{

      display:none !important;

    }


    @media(max-width:850px){

      nav a.notification-nav{

        display:inline-flex !important;

        margin-left:14px;

      }

    }

  `;


  document.head.appendChild(
    style
  );

}


/* =========================================================
   CREATE / FIND GLOBAL BELL
========================================================= */

function getGlobalNotificationLink(){

  const nav =
    document.querySelector(
      "nav"
    );


  if(!nav){

    return null;

  }


  /*
    If current page already has a bell,
    reuse it.
  */

  let link =

    nav.querySelector(
      'a[href="notifications.html"]'
    );


  if(link){

    link.classList.add(
      "notification-nav"
    );


    link.dataset.i18nTitle =
      "nav.notifications";


    link.title =
      t(
        "nav.notifications"
      );


    link.setAttribute(

      "aria-label",

      t(
        "nav.notifications"
      )

    );


    let badge =

      link.querySelector(
        ".nav-badge"
      );


    if(!badge){

      badge =
        document.createElement(
          "span"
        );


      badge.className =
        "nav-badge";


      badge.hidden =
        true;


      badge.textContent =
        "0";


      link.appendChild(
        badge
      );

    }


    return link;

  }


  /*
    Otherwise create bell.
  */

  link =
    document.createElement(
      "a"
    );


  link.href =
    "notifications.html";


  link.className =
    "notification-nav";


  link.dataset.i18nTitle =
    "nav.notifications";


  link.title =
    t(
      "nav.notifications"
    );


  link.setAttribute(

    "aria-label",

    t(
      "nav.notifications"
    )

  );


  link.innerHTML = `

    🔔

    <span
      class="nav-badge"
      hidden>

      0

    </span>

  `;


  /*
    Put notification bell before
    language selector.
  */

  const languageControl =

    nav.querySelector(
      ".language-control"
    );


  if(languageControl){

    nav.insertBefore(

      link,

      languageControl

    );

  }

  else{

    nav.appendChild(
      link
    );

  }


  return link;

}


/* =========================================================
   GET NOTIFICATION DATA
========================================================= */

async function getGlobalNotifications(){

  /*
    Pages using api.js already have call().
  */

  if(
    typeof call
    ===
    "function"
  ){

    return await call(
      "/api/notifications?limit=100"
    );

  }


  /*
    Fake data support.
  */

  if(
    typeof USE_FAKE_DATA
    !==
    "undefined"

    &&

    USE_FAKE_DATA
  ){

    if(
      typeof FAKE_NOTIFICATIONS
      !==
      "undefined"
    ){

      return FAKE_NOTIFICATIONS;

    }


    return [];

  }


  /*
    Pages such as Home or Map may not
    load api.js.

    Use API_BASE directly.
  */

  let base =

    typeof API_BASE
    !==
    "undefined"

    ?

    String(
      API_BASE
    )

    :

    "http://127.0.0.1:5000";


  base =

    base.replace(
      /\/+$/,
      ""
    );


  const response =

    await fetch(

      base

      +

      "/api/notifications?limit=100"

    );


  if(
    !response.ok
  ){

    throw new Error(

      "Notification API error "

      +

      response.status

    );

  }


  return await response.json();

}


/* =========================================================
   UPDATE GLOBAL BELL
========================================================= */

async function updateGlobalNotificationBell(){

  const link =
    getGlobalNotificationLink();


  if(!link){

    return;

  }


  const badge =

    link.querySelector(
      ".nav-badge"
    );


  if(!badge){

    return;

  }


  try{


    const notifications =
      await getGlobalNotifications();


    const items =

      Array.isArray(
        notifications
      )

      ?

      notifications

      :

      [];


    const unread =

      items.filter(

        item =>

          Number(
            item.is_read
          )
          ===
          0

      ).length;


    badge.textContent =

      unread > 99

      ?

      "99+"

      :

      String(
        unread
      );


    badge.hidden =
      unread === 0;


    const translatedTitle =
      t(
        "nav.notifications"
      );


    link.title =

      unread > 0

      ?

      `${translatedTitle} (${unread})`

      :

      translatedTitle;


    link.setAttribute(

      "aria-label",

      link.title

    );


  }

  catch(error){


    /*
      Notification API failure should
      never break the page.
    */

    badge.hidden =
      true;


    console.warn(

      "Notification bell could not refresh:",

      error

    );

  }

}


/* =========================================================
   INITIALIZE GLOBAL BELL
========================================================= */

function initializeGlobalNotificationBell(){

  setupGlobalNotificationStyles();


  getGlobalNotificationLink();


  updateGlobalNotificationBell();


  if(
    globalNotificationTimer
  ){

    clearInterval(
      globalNotificationTimer
    );

  }


  globalNotificationTimer =

    setInterval(

      updateGlobalNotificationBell,

      GLOBAL_NOTIFICATION_REFRESH_MS

    );

}


/* =========================================================
   LANGUAGE CHANGE → UPDATE BELL
========================================================= */

window.addEventListener(

  "languagechange",

  () => {


    const link =
      getGlobalNotificationLink();


    if(link){

      link.title =
        t(
          "nav.notifications"
        );


      link.setAttribute(

        "aria-label",

        t(
          "nav.notifications"
        )

      );

    }


    updateGlobalNotificationBell();

  }

);


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(

  "DOMContentLoaded",

  () => {


    setupLanguageSelectors();


    applyTranslations();


    initializeGlobalNotificationBell();


  }

); 