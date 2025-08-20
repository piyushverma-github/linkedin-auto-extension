(() => {
    // Variables to hold how many likes & comments the user wants
    let likec, commentc;

    // Counters to track how many likes/comments we have already done
    let i = 0, k = 0;

    // --- STEP 1: Receive values from popup.js ---
    // When popup sends data (like count & comment count), store them
    chrome.runtime.sendMessage(
        { data: "DataFetched Successfully" },
        function (response) {
            likec = parseInt(response.data);   // number of likes
            commentc = parseInt(response.data1); // number of comments

            console.log("👍 Like count: " + likec);
            console.log("💬 Comment count: " + commentc);
        }
    );

    // --- STEP 2: Main function that performs Like & Comment ---
    function changehere() {
        try {
            // ---- LIKE PART ----
            if (i < likec) { // Only run if we still need to like more posts
                // Grab all Like buttons from feed
                let likeButtons = document.querySelectorAll(
                    '.feed-shared-social-action-bar__action-button .react-button__trigger'
                );

                // If the Like button exists, click it
                if (likeButtons && likeButtons[i]) {
                    likeButtons[i].click();
                    console.log(`✅ Liked post #${i + 1}`);
                    i++; // Move to next post
                }
            }

            // ---- COMMENT PART ----
            if (k < commentc) { // Only run if we still need to comment more posts
                // Grab all Comment buttons
                let commentButtons = document.querySelectorAll(
                    'button[aria-label*="Comment"]'
                );

                // If the Comment button exists, click it
                if (commentButtons && commentButtons[k]) {
                    commentButtons[k].click();
                    console.log(`📝 Opened comment box for post #${k + 1}`);

                    // Wait a little so LinkedIn has time to open the comment box
                    setTimeout(() => {
                        // Grab all comment input boxes (LinkedIn uses "ql-editor")
                        let commentBoxes = document.querySelectorAll(
                            'div.comments-comment-box__contenteditable, div.ql-editor'
                        );

                        // If a comment box exists, insert our text
                        if (commentBoxes && commentBoxes[k]) {
                            let box = commentBoxes[k];
                            box.focus();
                            box.textContent = "CFBR"; // The actual text we want to post

                            // Fire an input event so LinkedIn "sees" the new text
                            let inputEvent = new InputEvent('input', { bubbles: true });
                            box.dispatchEvent(inputEvent);

                            // Find the Post button (LinkedIn renamed it with --cr suffix)
                            let postButtons = document.querySelectorAll(
                                'button.comments-comment-box__submit-button--cr'
                            );

                            // If Post button exists, click it
                            if (postButtons && postButtons[k]) {
                                postButtons[k].click();
                                console.log(`✅ Commented on post #${k + 1}`);
                                k++; // Move to next post
                            } else {
                                console.log("⚠️ Post button not found for post #" + (k + 1));
                            }
                        } else {
                            console.log("⚠️ Comment box not found for post #" + (k + 1));
                        }
                    }, 2000); // wait 2 seconds for box to fully render
                }
            }
        } catch (err) {
            console.error("⚠️ Error in changehere(): ", err);
        }
    }

    // --- STEP 3: Run the function repeatedly ---
    // Runs every 4 seconds, which is safe timing for LinkedIn
    setInterval(changehere, 4000);
})();
