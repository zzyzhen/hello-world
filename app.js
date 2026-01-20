// Sample user profiles with Hinge-style prompts
const profiles = [
    {
        id: 1,
        name: "Sarah",
        age: 28,
        location: "Brooklyn, NY",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop",
        prompts: [
            {
                question: "My simple pleasures",
                answer: "Sunday morning farmer's markets, trying new coffee shops, and getting lost in a good book on rainy days"
            },
            {
                question: "I'm looking for",
                answer: "Someone who can laugh at themselves and isn't afraid to be goofy. Bonus points if you love spontaneous adventures!"
            },
            {
                question: "Two truths and a lie",
                answer: "I've been skydiving, I can speak three languages fluently, I once ate an entire pizza by myself"
            }
        ]
    },
    {
        id: 2,
        name: "Michael",
        age: 30,
        location: "Manhattan, NY",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop",
        prompts: [
            {
                question: "My perfect Sunday",
                answer: "Brunch with friends, a long bike ride through Central Park, and ending the day with live music at a local bar"
            },
            {
                question: "I geek out on",
                answer: "Craft beer brewing, vintage vinyl records, and the science behind great coffee"
            },
            {
                question: "The way to win me over is",
                answer: "Cook me a homemade meal or take me to a hidden gem restaurant I've never heard of"
            }
        ]
    },
    {
        id: 3,
        name: "Emily",
        age: 26,
        location: "Williamsburg, NY",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop",
        prompts: [
            {
                question: "Most spontaneous thing I've done",
                answer: "Quit my corporate job to travel Southeast Asia for 6 months. Best decision ever!"
            },
            {
                question: "We'll get along if",
                answer: "You appreciate dark humor, love trying new cuisines, and won't judge me for my terrible karaoke performances"
            },
            {
                question: "I'm passionate about",
                answer: "Environmental sustainability, abstract art, and finding the best tacos in NYC"
            }
        ]
    },
    {
        id: 4,
        name: "David",
        age: 32,
        location: "Park Slope, NY",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
        prompts: [
            {
                question: "My ideal date",
                answer: "Starting with drinks at a rooftop bar, followed by exploring a night market, and ending with late-night pizza"
            },
            {
                question: "I'm overly competitive about",
                answer: "Board games, trivia nights, and finding the shortest route on Google Maps"
            },
            {
                question: "Green flags I look for",
                answer: "Good communication, kindness to service workers, and someone who has a passport full of stamps"
            }
        ]
    },
    {
        id: 5,
        name: "Jessica",
        age: 29,
        location: "Queens, NY",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop",
        prompts: [
            {
                question: "I'm weirdly attracted to",
                answer: "People who are passionate about niche hobbies and can teach me something new"
            },
            {
                question: "My love language is",
                answer: "Quality time and sharing experiences - let's go on adventures together!"
            },
            {
                question: "I want someone who",
                answer: "Values deep conversations, loves their morning coffee as much as I do, and isn't afraid of commitment"
            }
        ]
    },
    {
        id: 6,
        name: "Alex",
        age: 27,
        location: "Astoria, NY",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop",
        prompts: [
            {
                question: "Typical Sunday",
                answer: "Playing soccer in the park, meal prepping for the week, and catching up on my favorite podcasts"
            },
            {
                question: "Together we could",
                answer: "Take a cooking class, explore hidden neighborhoods in NYC, or plan our next travel adventure"
            },
            {
                question: "I know the best spot in town for",
                answer: "Authentic ramen, sunset views, and live jazz music"
            }
        ]
    }
];

// App state
let currentProfileIndex = 0;
let likedProfiles = [];
let matches = [];
let currentChat = null;
let chatMessages = {};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    loadProfile();
    initializeActionButtons();
    initializeModal();
    initializeChat();

    // Simulate some existing matches for demo
    setTimeout(() => {
        simulateMatches();
    }, 500);
});

// Navigation
function initializeNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active nav button
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Show corresponding view
            const viewName = btn.dataset.view;
            showView(viewName);
        });
    });
}

function showView(viewName) {
    const views = document.querySelectorAll('.view');
    views.forEach(view => view.classList.remove('active'));

    const targetView = document.getElementById(`${viewName}-view`);
    if (targetView) {
        targetView.classList.add('active');

        // Update content when switching views
        if (viewName === 'matches') {
            renderMatches();
        } else if (viewName === 'likes') {
            renderLikes();
        }
    }
}

// Profile rendering
function loadProfile() {
    const profileCard = document.getElementById('profileCard');
    const noProfiles = document.getElementById('noProfiles');
    const actionButtons = document.getElementById('actionButtons');

    if (currentProfileIndex >= profiles.length) {
        profileCard.style.display = 'none';
        actionButtons.style.display = 'none';
        noProfiles.style.display = 'block';
        return;
    }

    const profile = profiles[currentProfileIndex];

    profileCard.innerHTML = `
        <div class="profile-header">
            <img src="${profile.image}" alt="${profile.name}" class="profile-image">
            <div class="profile-info-overlay">
                <div class="profile-name">${profile.name}, ${profile.age}</div>
                <div class="profile-details">${profile.location}</div>
            </div>
        </div>
        <div class="profile-body">
            ${profile.prompts.map((prompt, index) => `
                <div class="prompt-section" data-prompt-index="${index}">
                    <div class="prompt-question">${prompt.question}</div>
                    <div class="prompt-answer">${prompt.answer}</div>
                </div>
            `).join('')}
        </div>
    `;

    // Add click listeners to prompts for commenting
    const promptSections = profileCard.querySelectorAll('.prompt-section');
    promptSections.forEach(section => {
        section.addEventListener('click', () => {
            const promptIndex = section.dataset.promptIndex;
            openCommentModal(promptIndex);
        });
    });

    profileCard.style.display = 'block';
    actionButtons.style.display = 'flex';
    noProfiles.style.display = 'none';
}

// Action buttons
function initializeActionButtons() {
    document.getElementById('passBtn').addEventListener('click', handlePass);
    document.getElementById('likeBtn').addEventListener('click', handleLike);
    document.getElementById('commentBtn').addEventListener('click', () => openCommentModal(0));
}

function handlePass() {
    animateCardExit('left');
    setTimeout(() => {
        currentProfileIndex++;
        loadProfile();
    }, 300);
}

function handleLike() {
    const profile = profiles[currentProfileIndex];
    likedProfiles.push({
        ...profile,
        comment: null
    });

    // 50% chance of matching
    if (Math.random() > 0.5) {
        createMatch(profile);
    }

    animateCardExit('right');
    setTimeout(() => {
        currentProfileIndex++;
        loadProfile();
    }, 300);
}

function animateCardExit(direction) {
    const profileCard = document.getElementById('profileCard');
    const translateX = direction === 'left' ? '-100%' : '100%';
    profileCard.style.transition = 'transform 0.3s ease-out, opacity 0.3s';
    profileCard.style.transform = `translateX(${translateX}) rotate(${direction === 'left' ? -20 : 20}deg)`;
    profileCard.style.opacity = '0';

    setTimeout(() => {
        profileCard.style.transition = 'none';
        profileCard.style.transform = 'translateX(0) rotate(0)';
        profileCard.style.opacity = '1';
    }, 300);
}

// Comment modal
function initializeModal() {
    const modal = document.getElementById('commentModal');
    const closeBtn = document.getElementById('closeModal');
    const sendBtn = document.getElementById('sendComment');

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    sendBtn.addEventListener('click', handleCommentSend);
}

let currentPromptIndex = 0;

function openCommentModal(promptIndex) {
    const profile = profiles[currentProfileIndex];
    const prompt = profile.prompts[promptIndex];

    currentPromptIndex = promptIndex;

    document.getElementById('promptText').textContent = `"${prompt.answer}"`;
    document.getElementById('commentInput').value = '';
    document.getElementById('commentModal').classList.add('active');
}

function handleCommentSend() {
    const comment = document.getElementById('commentInput').value.trim();
    const profile = profiles[currentProfileIndex];

    if (comment) {
        likedProfiles.push({
            ...profile,
            comment: comment
        });

        // Higher chance of matching with a comment
        if (Math.random() > 0.3) {
            createMatch(profile, comment);
        }

        document.getElementById('commentModal').classList.remove('active');
        animateCardExit('right');

        setTimeout(() => {
            currentProfileIndex++;
            loadProfile();
        }, 300);
    }
}

// Matches
function createMatch(profile, comment = null) {
    if (!matches.find(m => m.id === profile.id)) {
        matches.push({
            ...profile,
            matchedAt: new Date(),
            lastMessage: comment || "You matched!",
            unread: comment ? true : false
        });

        // Initialize chat messages
        if (!chatMessages[profile.id]) {
            chatMessages[profile.id] = [];
            if (comment) {
                chatMessages[profile.id].push({
                    type: 'sent',
                    text: comment,
                    timestamp: new Date()
                });
            }
        }
    }
}

function simulateMatches() {
    // Add a few pre-existing matches for demo
    const sampled = profiles.slice(0, 2);
    sampled.forEach((profile, index) => {
        matches.push({
            ...profile,
            matchedAt: new Date(Date.now() - (index + 1) * 86400000),
            lastMessage: index === 0 ? "Hey! How's your week going?" : "You matched!",
            unread: index === 0
        });

        if (!chatMessages[profile.id]) {
            chatMessages[profile.id] = [];
            if (index === 0) {
                chatMessages[profile.id].push({
                    type: 'received',
                    text: "Hey! How's your week going?",
                    timestamp: new Date(Date.now() - 3600000)
                });
            }
        }
    });
}

function renderMatches() {
    const matchesList = document.getElementById('matchesList');

    if (matches.length === 0) {
        matchesList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">No matches yet. Keep swiping!</p>';
        return;
    }

    matchesList.innerHTML = matches.map(match => `
        <div class="match-item" data-match-id="${match.id}">
            <img src="${match.image}" alt="${match.name}" class="match-avatar">
            <div class="match-info">
                <div class="match-name">${match.name}</div>
                <div class="match-message">${match.lastMessage}</div>
            </div>
            ${match.unread ? '<span class="match-badge">New</span>' : ''}
        </div>
    `).join('');

    // Add click listeners
    const matchItems = matchesList.querySelectorAll('.match-item');
    matchItems.forEach(item => {
        item.addEventListener('click', () => {
            const matchId = parseInt(item.dataset.matchId);
            openChat(matchId);
        });
    });
}

function renderLikes() {
    const likesList = document.getElementById('likesList');

    if (likedProfiles.length === 0) {
        likesList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">No likes yet. Start swiping!</p>';
        return;
    }

    likesList.innerHTML = likedProfiles.map(profile => `
        <div class="like-item">
            <img src="${profile.image}" alt="${profile.name}" class="match-avatar">
            <div class="match-info">
                <div class="match-name">${profile.name}, ${profile.age}</div>
                <div class="match-message">${profile.comment ? `"${profile.comment.substring(0, 50)}..."` : 'Liked'}</div>
            </div>
        </div>
    `).join('');
}

// Chat functionality
function initializeChat() {
    const backBtn = document.getElementById('backToMatches');
    const sendBtn = document.getElementById('sendBtn');
    const chatInput = document.getElementById('chatInput');

    backBtn.addEventListener('click', () => {
        showView('matches');
        document.querySelector('[data-view="matches"]').classList.add('active');
        document.querySelector('[data-view="discover"]').classList.remove('active');
        document.querySelector('[data-view="likes"]').classList.remove('active');
    });

    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

function openChat(matchId) {
    currentChat = matches.find(m => m.id === matchId);
    if (!currentChat) return;

    // Mark as read
    currentChat.unread = false;

    // Update header
    document.getElementById('chatName').textContent = currentChat.name;

    // Render messages
    renderChatMessages();

    // Show chat view
    const views = document.querySelectorAll('.view');
    views.forEach(view => view.classList.remove('active'));
    document.getElementById('chat-view').classList.add('active');
}

function renderChatMessages() {
    const chatMessagesContainer = document.getElementById('chatMessages');
    const messages = chatMessages[currentChat.id] || [];

    if (messages.length === 0) {
        chatMessagesContainer.innerHTML = '<p style="text-align: center; color: #999;">Start the conversation!</p>';
    } else {
        chatMessagesContainer.innerHTML = messages.map(msg => `
            <div class="message ${msg.type}">
                ${msg.text}
            </div>
        `).join('');
    }

    // Scroll to bottom
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();

    if (!text || !currentChat) return;

    // Add message to chat
    if (!chatMessages[currentChat.id]) {
        chatMessages[currentChat.id] = [];
    }

    chatMessages[currentChat.id].push({
        type: 'sent',
        text: text,
        timestamp: new Date()
    });

    // Update last message in match
    currentChat.lastMessage = text;

    // Clear input
    input.value = '';

    // Re-render messages
    renderChatMessages();

    // Simulate response after a delay
    setTimeout(() => {
        const responses = [
            "That's interesting! Tell me more 😊",
            "Haha I love that!",
            "Same here! What else do you like?",
            "That sounds amazing! I'd love to try that",
            "You seem really cool! When are you free to meet up?"
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];

        chatMessages[currentChat.id].push({
            type: 'received',
            text: randomResponse,
            timestamp: new Date()
        });

        currentChat.lastMessage = randomResponse;
        currentChat.unread = true;

        renderChatMessages();
    }, 1000 + Math.random() * 2000);
}
