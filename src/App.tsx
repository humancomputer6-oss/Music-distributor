/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DistroProvider, useDistro } from './context/DistroContext';
import { TopBar } from './components/TopBar';
import { DashboardOverview } from './components/DashboardOverview';
import { CatalogManager } from './components/CatalogManager';
import { RoyaltiesPayouts } from './components/RoyaltiesPayouts';
import { AnalyticsDemographics } from './components/AnalyticsDemographics';
import { FanSubscriptions } from './components/FanSubscriptions';
import { CollaboratorSplits } from './components/CollaboratorSplits';
import { AccountSecurity } from './components/AccountSecurity';
import { ReleaseUploadModal } from './components/ReleaseUploadModal';
import { SocialShareModal } from './components/SocialShareModal';
import { NotificationsPanel } from './components/NotificationsPanel';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { MobileFrameWrapper } from './components/MobileFrameWrapper';

const MainLayout: React.FC = () => {
  const {
    activeTab,
    selectedReleaseForShare,
    setSelectedReleaseForShare,
    selectedReleaseForUpload,
    setSelectedReleaseForUpload,
    user,
  } = useDistro();

  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-400 selection:text-neutral-950">
      {/* Top Bar with 3-Zone Contract */}
      <TopBar
        onOpenNotifications={() => setNotificationsOpen(true)}
        onOpenUpload={() => setSelectedReleaseForUpload(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28">
        <MobileFrameWrapper>
          {activeTab === 'overview' && (
            <DashboardOverview
              onOpenPayout={() => {}}
              onOpenUpload={() => setSelectedReleaseForUpload(true)}
            />
          )}

          {activeTab === 'catalog' && (
            <CatalogManager onOpenUpload={() => setSelectedReleaseForUpload(true)} />
          )}

          {activeTab === 'royalties' && <RoyaltiesPayouts />}

          {activeTab === 'analytics' && <AnalyticsDemographics />}

          {activeTab === 'fans' && <FanSubscriptions />}

          {activeTab === 'splits' && <CollaboratorSplits />}

          {activeTab === 'settings' && <AccountSecurity />}
        </MobileFrameWrapper>
      </main>

      {/* Release Upload & Distribution Wizard Modal */}
      <ReleaseUploadModal
        isOpen={selectedReleaseForUpload}
        onClose={() => setSelectedReleaseForUpload(false)}
      />

      {/* Smart Link & Social Share Modal */}
      <SocialShareModal
        release={selectedReleaseForShare}
        onClose={() => setSelectedReleaseForShare(null)}
      />

      {/* Push Notifications Center Drawer */}
      <NotificationsPanel
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />

      {/* Audio Playback Bar */}
      <AudioPlayerBar />
    </div>
  );
};

export default function App() {
  return (
    <DistroProvider>
      <MainLayout />
    </DistroProvider>
  );
}
